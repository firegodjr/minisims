import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../input/input.js";
import { Tiles, TILE_DEGRADE_TABLE } from "../constants.js";
import { ChangeSelectedEvent, AddDroneEvent } from "../event/events.js";
import { Table } from "../util/util.js";
declare var Zdog: any;

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

interface IVariedColor
{
    r: number,
    g: number,
    b: number,
    v?: number
}

class Tile
{
    type: Tiles;
    color: IVariedColor;
    color_offset: IVariedColor; // Added to color before finalizing
    height: number;
    grass_color: string;
    stroke: number;
    grass_density: number;
    grass_height: number;
    grass_height_variation: number;
    optimize_grass: boolean;

    get_color()
    {
        if(this.color_offset !== undefined)
        {
            return varied_color({ 
                r: this.color.r + this.color_offset.r, 
                g: this.color.g + this.color_offset.g,
                b: this.color.b + this.color_offset.b,
                v: this.color.v + this.color_offset.v
            });
        }
        else
        {
            return varied_color(this.color);
        }
    }

    constructor(type: Tiles, color: IVariedColor, grass_stroke: number, grass_density: number, grass_height: number, height_variation: number, optimize_grass: boolean, height?: number, color_offset?: IVariedColor, grass_color?: string)
    {
        this.type = type;
        this.color = color;
        this.stroke = grass_stroke;
        this.height = height;
        this.grass_density = grass_density;
        this.grass_height = grass_height;
        this.grass_height_variation = height_variation;
        this.optimize_grass = optimize_grass;
        this.color_offset = color_offset;
        this.grass_color = grass_color;
    }
}

class TileCreator
{
    colorTable = new Table([
        { key: Tiles.GRASS, value: { r: 35, g: 135, b: 43, v: 7 }},
        { key: Tiles.WHEAT, value: { r: 100, g: 75, b: 45 }},
        { key: Tiles.WHEAT_RIPE, value: { r: 210, g: 155, b: 94 }},
        { key: Tiles.STONE, value: { r: 150, g: 150, b: 150, v: 5 }},
        { key: Tiles.ORE, value: { r: 80, g: 80, b: 80, v: 5 }},
        { key: Tiles.ORE_RIPE, value: { r: 80, g: 80, b: 80, v: 5 }},
        { key: Tiles.WATER, value: { r: 110, g: 210, b: 190, v: 0 }}
    ]);

    densityTable = new Table([
        { key: Tiles.GRASS, value: 8 },
        { key: Tiles.WHEAT_RIPE, value: 5 },
        { key: Tiles.ORE_RIPE, value: 2 },
        { key: Tiles.WHEAT, value: 0 },
        { key: Tiles.STONE, value: 0 },
        { key: Tiles.ORE, value: 0 },
        { key: Tiles.WATER, value: 0}
    ]);

    heightTable = new Table([
        { key: Tiles.WHEAT_RIPE, value: 20 },
        { key: Tiles.GRASS, value: 10 }
    ]);

    variationTable = new Table([
        { key: Tiles.WHEAT_RIPE, value: 0.2 },
        { key: Tiles.GRASS, value: 1 },
    ]);

    grassColorTable = new Table([
        { key: Tiles.ORE_RIPE, value: "#930" }
    ]);

    optimizeTable = new Table([
        { key: Tiles.WHEAT_RIPE, value: false }
    ]);
    create(type: Tiles) : Tile
    {   let tile = new Tile(type, Object.assign({}, this.colorTable.get(type)), 4, this.densityTable.get(type), this.heightTable.get(type), this.variationTable.get(type), this.optimizeTable.get(type), 0, undefined, this.grassColorTable.get(type));
        return tile;
    }
}

class GameState
{
    m_tiles: Array<Array<Tile>>;
    m_drones: Array<Drone>;
    m_selected_drone: number;
    m_zoom: number;
    m_pitch: number;
    m_rotation: number;
    m_dirty_tiles: Array<Coords> // coordinates of tiles that need to be refreshed
    m_input_mgr: InputManager;
    m_tile_creator: TileCreator;

    constructor()
    {
        this.m_tiles = [];
        this.m_drones = [];
        this.m_selected_drone = 0;
        this.m_zoom = 1;
        this.m_pitch = -Zdog.TAU / 12;
        this.m_rotation = -Zdog.TAU / 8;
        this.m_dirty_tiles = [];
        this.m_input_mgr = new InputManager();
        this.m_tile_creator = new TileCreator();
    }

    harvest(x: number, y: number)
    {
        this.m_tiles[x][y] = this.m_tile_creator.create(TILE_DEGRADE_TABLE.get(this.m_tiles[x][y].type));
        this.m_dirty_tiles.push(new Coords(x, y));
    }

    select_drone(index: number)
    {
        this.m_selected_drone = index;
        document.dispatchEvent(ChangeSelectedEvent(index));
    }

    add_drone(pos_x: number = 0, pos_y: number = 0)
    {
        if(this.m_tiles && this.m_tiles.length > 0)
        {
            pos_x = Math.floor(Math.random() * this.m_tiles.length);
            pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            
            while(this.m_tiles[pos_x][pos_y].type == Tiles.WATER)
            {
                pos_x = Math.floor(Math.random() * this.m_tiles.length);
                pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            }
        }
        var drone_index = this.m_drones.length;
        this.m_drones.push(new Drone(drone_index, pos_x, pos_y, JobCitizen()));
        document.dispatchEvent(AddDroneEvent(pos_x, pos_y));
    }
}

function semi_random_color(r: number, g: number, b: number, variation: number = 10)
{
    return `rgb(${Zdog.lerp(r-variation, r+variation, Math.random())}, ${Zdog.lerp(g-variation, g+variation, Math.random())}, ${Zdog.lerp(b-variation, b+variation, Math.random())}`;
}

function varied_color(color: IVariedColor)
{
    return semi_random_color(color.r, color.g, color.b, color.v);
}

export { Coords, ICoords, GameState, Tile, TileCreator };