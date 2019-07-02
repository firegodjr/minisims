import { Drone, DroneHelper } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../io/input.js";
import { TileTypes, TILE_DEGRADE_TABLE, Goals, Items, TILE_HARVEST_TABLE } from "../constants.js";
import { ChangeSelectedEvent, AddDroneEvent, ChangeGoalEvent, TickEvent } from "../event/events.js";
import { Table } from "../util/table.js";
import { GenerateTiles } from './tilegenerator.js';
import { ChangeTileEvent } from '../event/events.js';
import { GameStateDTO } from "../network/dto.js";
declare var Zdog: any;

/**
 * Represents any object containing numeric x and y properties
 */
interface ICoords
{
    x: number;
    y: number;
}

class Coords
{
    x: number;
    y: number;
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}

/**
 * An object that contains color data, and optional amount of noise variation
 */
interface IVariedColor
{
    r: number,
    g: number,
    b: number,
    v?: number
}

class Tile implements SerialTile
{
    type: TileTypes;
    color: IVariedColor;
    colorOffset: IVariedColor; // Added to color before finalizing
    height: number;
    grassColor: string;
    stroke: number;
    grassDensity: number;
    grassHeight: number;
    grassHeightVariation: number;
    optimizeGrass: boolean;

    getColor()
    {
        if(this.colorOffset !== undefined)
        {
            return variedColor({ 
                r: this.color.r + this.colorOffset.r, 
                g: this.color.g + this.colorOffset.g,
                b: this.color.b + this.colorOffset.b,
                v: this.color.v + this.colorOffset.v
            });
        }
        else
        {
            return variedColor(this.color);
        }
    }

    constructor(type: TileTypes, color: IVariedColor, grassStroke: number, grassDensity: number, grassHeight: number, grassHeightVariation: number, optimizeGrass: boolean, height?: number, colorOffset?: IVariedColor, grassColor?: string)
    {
        this.type = type;
        this.color = color;
        this.stroke = grassStroke;
        this.height = height;
        this.grassDensity = grassDensity;
        this.grassHeight = grassHeight;
        this.grassHeightVariation = grassHeightVariation;
        this.optimizeGrass = optimizeGrass;
        this.colorOffset = colorOffset;
        this.grassColor = grassColor;
    }
}

/**
 * Generates tile objects from tile type
 */
class TileCreator
{
    colorTable = new Table([
        { key: TileTypes.GRASS, value: { r: 35, g: 135, b: 43, v: 7 }},
        { key: TileTypes.WHEAT, value: { r: 100, g: 75, b: 45 }},
        { key: TileTypes.WHEAT_RIPE, value: { r: 210, g: 155, b: 94, v: 10 }},
        { key: TileTypes.STONE, value: { r: 150, g: 150, b: 150, v: 5 }},
        { key: TileTypes.ORE, value: { r: 80, g: 80, b: 80, v: 5 }},
        { key: TileTypes.ORE_RIPE, value: { r: 80, g: 80, b: 80, v: 5 }},
        { key: TileTypes.WATER, value: { r: 110, g: 210, b: 190, v: 0 }}
    ]);

    densityTable = new Table([
        { key: TileTypes.GRASS, value: 6 },
        { key: TileTypes.WHEAT_RIPE, value: 5 },
        { key: TileTypes.ORE_RIPE, value: 2 },
        { key: TileTypes.WHEAT, value: 0 },
        { key: TileTypes.STONE, value: 0 },
        { key: TileTypes.ORE, value: 0 },
        { key: TileTypes.WATER, value: 0}
    ]);

    heightTable = new Table([
        { key: TileTypes.WHEAT_RIPE, value: 20 },
        { key: TileTypes.GRASS, value: 10 }
    ]);

    variationTable = new Table([
        { key: TileTypes.WHEAT_RIPE, value: 0.2 },
        { key: TileTypes.GRASS, value: 1 },
    ]);

    grassColorTable = new Table([
        { key: TileTypes.ORE_RIPE, value: "#930" }
    ]);

    optimizeTable = new Table([
        { key: TileTypes.WHEAT_RIPE, value: false }
    ]);

    /**
     * Creates a Tile object given a single tile type
     * @param type 
     */
    create(type: TileTypes) : Tile
    {   let tile = new Tile(type, Object.assign({}, this.colorTable.get(type)), 4, this.densityTable.get(type), this.heightTable.get(type), this.variationTable.get(type), this.optimizeTable.get(type), 0, undefined, this.grassColorTable.get(type));
        return tile;
    }
}

/**
 * The bare essentials required to (de)serialize a Tile object
 */
interface SerialTile
{
    type: number;
    height: number;
}

/**
 * The representation of the game currently being played
 */
class GameState
{
    name: string;
    tiles: Array<Array<Tile>>;
    drones: Array<Drone>;
    selectedDrone: number;
    zoom: number;
    pitch: number;
    rotation: number;
    dirtyTiles: Array<Coords> // coordinates of tiles that need to be refreshed
    inputMgr: InputManager;
    tileCreator: TileCreator;

    constructor(name: string = "default", obj?: GameStateDTO)
    {
        this.name = name;
        this.tiles = [];
        this.drones = [];
        this.selectedDrone = 0;
        this.zoom = 1;
        this.pitch = -Zdog.TAU / 12;
        this.rotation = Zdog.TAU * 7 / 8;
        this.dirtyTiles = [];
        this.inputMgr = new InputManager();
        this.tileCreator = new TileCreator();

        if(obj)
        {
            GenerateTiles(this, obj.tiles.length, obj.tiles[0].length, obj.tiles);

            this.name = obj.name;
            this.drones = obj.drones;
            this.selectedDrone = obj.selectedDrone;
        }
    }

    setTile(x: number, y: number, type: TileTypes)
    {
        let oldHeight = 0;
        if(this.tiles.length > 0)
        {
            oldHeight = this.tiles[x][y].height;
        }
        this.tiles[x][y] = this.tileCreator.create(type);
        this.tiles[x][y].height = oldHeight;
        this.dirtyTiles.push(new Coords(x, y));

        document.dispatchEvent(ChangeTileEvent(x, y, type));
    }

    updateTile(x: number, y: number, type: TileTypes)
    {
        let oldHeight = 0;
        if(this.tiles.length > 0)
        {
            oldHeight = this.tiles[x][y].height;
        }
        this.tiles[x][y] = this.tileCreator.create(type);
        this.tiles[x][y].height = oldHeight;
        this.dirtyTiles.push(new Coords(x, y));
    }

    /**
     * Selects the drone at the given index in the game's list of drones
     * @param index 
     */
    selectDrone(index: number)
    {
        this.selectedDrone = index;
        document.dispatchEvent(ChangeSelectedEvent(index));
    }

    /**
     * Adds a drone at the given position
     * @param posX 
     * @param posY 
     */
    addDrone(posX?: number, posY?: number)
    {
        if(!posX && !posY)
        {
            if(this.tiles && this.tiles.length > 0)
            {
                posX = Math.floor(Math.random() * this.tiles.length);
                posY = Math.floor(Math.random() * this.tiles[0].length);
                
                while(this.tiles[posX][posY].type == TileTypes.WATER)
                {
                    posX = Math.floor(Math.random() * this.tiles.length);
                    posY = Math.floor(Math.random() * this.tiles[0].length);
                }
            }
            else
            {
                posX = 0;
                posY = 0;
            }
        }

        var droneIndex = this.drones.length;
        document.dispatchEvent(AddDroneEvent(posX, posY));
    }

    /**
     * @returns A stripped-down JSON string containing only essential GameState information
     */
    serialize()
    {
        let serialTiles = [];
        for(let i = 0; i < this.tiles.length; ++i)
        {
            serialTiles.push([])
            for(let j = 0; j < this.tiles[i].length; ++j)
            {
                serialTiles[i].push({ type: this.tiles[i][j].type, height: this.tiles[i][j].height });
            }
        }

        let serial: GameStateDTO = 
        {
            name: this.name,
            tiles: serialTiles,
            drones: this.drones,
            selectedDrone: this.selectedDrone
        };

        return JSON.stringify(serial);
    }

    /**
     * Parses a stripped-down JSON GameState and loads it into this full GameState object
     * @param serial 
     */
    deserialize(parsed: GameStateDTO)
    {
        // Takes care of m_tiles
        GenerateTiles(this, parsed.tiles.length, parsed.tiles[0].length, parsed.tiles);

        if(parsed.drones)
        {
            this.drones = parsed.drones;
        }
        
        this.selectedDrone = parsed.selectedDrone | this.selectedDrone;
    }
}

/**
 * Performs a logic update
 * @param game 
 * @param drone_helper 
 */
function doTick(game: GameState, drone_helper: DroneHelper)
{
    document.dispatchEvent(TickEvent());
}

/**
 * Produces a color with an optional amount of noise variation
 * @param r 
 * @param g 
 * @param b 
 * @param variation 
 */
function rawVariedColor(r: number, g: number, b: number, variation: number = 0)
{
    return `rgb(${Zdog.lerp(r-variation, r+variation, Math.random())}, ${Zdog.lerp(g-variation, g+variation, Math.random())}, ${Zdog.lerp(b-variation, b+variation, Math.random())}`;
}

/**
 * Converts raw IVariedColor information into an HTML color string
 * @param color 
 */
function variedColor(color: IVariedColor)
{
    return rawVariedColor(color.r, color.g, color.b, color.v);
}

export { Coords, ICoords, GameState, Tile, TileCreator, doTick, GameStateDTO, SerialTile };