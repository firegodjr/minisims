import { TileTypes } from "../constants.js";
import { Table } from "../util/table.js";
import { GameState, ICoords, TileCreator } from "../game/game.js";
import { Coords } from "../game/game.js";
import { ModelStore, jsonToZdog } from "./models.js";
import { Zdog } from '../zDog/zdog.js';
import { createZdogTile, createTile, addGrass } from "./add_detail.js";
import { Drone } from "../drone.js";
declare var Zdog: Zdog;

export const TILE_SIZE = 40;
const GRASS_THRESHOLD = 0.5;

/**
 * An object containing references to the scene layers and the tiles that make them up
 */
interface GridLayers
{
    tiles: Zdog.Group;
    highlights: Zdog.Group;
    grass: Zdog.Group;
    tileArr: Zdog.Shape[][];
    highlightArr: Zdog.Shape[][];
    grassArr: Zdog.Group[][];
}

/**
 * Manages functionality and interactivity of the canvas game board, synchronizing it with the gamestate for ease of access
 */
class BoardManager
{
    rotOffset: number;
    rotBuf: number;
    pitchOffset: number;
    pitchBuf: number;
    selectedTile: ICoords;
    isDragged: boolean;
    game: GameState;

    /**
     * 
     * @param game The gamestate to save rotation values to
     */
    constructor(game: GameState)
    {
        this.rotOffset = Zdog.TAU * 7 / 8;
        this.rotBuf = 0;
        this.pitchOffset = -Zdog.TAU / 12;
        this.pitchBuf = 0;
        this.selectedTile = new Coords(-1, -1);
        this.game = game;
    }

    /**
     * Handler for the Zdog dragStart event
     * @param pointer Mouse pointer coordinates
     */
    dragStart(pointer: Event | Touch)
    {
        this.isDragged = true;
    }

    /**
     * Handler for the Zdog dragMove event
     * @param pointer Mouse pointer coordinates
     * @param moveX Total amount of x movement in this drag
     * @param moveY Total amount of y movement in this drag
     */
    dragMove(pointer: Event | Touch, moveX: number, moveY: number)
    {
        this.game.pitch = Math.max(
            -Zdog.TAU / 5, Math.min(
                -Zdog.TAU / 20, -Zdog.TAU * moveY / 2000 + this.pitchOffset
                ));
        this.pitchBuf = this.game.pitch;

        this.game.rotation = -Zdog.TAU * moveX / 1000 + this.rotOffset;
        this.game.rotation = normalizeRotation(this.game.rotation);
        this.rotBuf = this.game.rotation;
    }

    /**
     * Handler for the Zdog dragEnd event
     */
    dragEnd()
    {
        this.rotOffset = this.game.rotation % Zdog.TAU;
        this.pitchOffset = this.game.pitch;
        this.game.rotation = normalizeRotation(this.game.rotation);
        this.isDragged = false;
    }

    /**
     * Selects a game tile
     * @param x X coordinate of the tile
     * @param y Y coordinate of the tile
     */
    selectTile(x: number, y: number)
    {
        this.selectedTile = new Coords(x, y);
    }
}

function initIllustration(game: GameState, boardMgr: BoardManager): GridLayers
{
    var halfBoard = ((game.tiles.length - 1) * TILE_SIZE / 2);

    if(!board) // Reuse existing illustration if possible, because draggable objects can't be garbage-collected
    {
        board = new Zdog.Illustration({
            element: "#cvs_viewport",
            resize: true,
            dragRotate: true,
            onDragStart: (p: Event | Touch) => boardMgr.dragStart(p),
            onDragMove: (p: Event | Touch, mx: number, my: number) => boardMgr.dragMove(p, mx, my),
            onDragEnd: () => boardMgr.dragEnd(),
            rotate: { x: -Zdog.TAU / 12, y: -Zdog.TAU /8 }
        });
    }

    for(var i = 0; i < board.children.length; ++i)
    {
        board.removeChild(board.children[i]);
    }

    var root = new Zdog.Group({
        addTo: board
    });

    var tiles = new Zdog.Group({
        addTo: root,
        updateSort: true
    });

    var grass = new Zdog.Group({
        addTo: root,
        updateSort: true
    });

    var highlights = new Zdog.Group({
        addTo: root
    });

    // Keeps track of all tiles for later changes
    var tileArr: any = [];
    var highlightArr: any = [];
    var grassArr: any = [];

    for(var i = 0; i < game.tiles.length; ++i)
    {
        const TILE_HEIGHT_AMNT = TILE_SIZE * 0;

        tileArr.push([]);
        highlightArr.push([]);
        grassArr.push([]);
        for(var j = 0; j < game.tiles[i].length; ++j)
        {
            var tile = game.tiles[i][j];
            var tileSurface = createZdogTile(game.tiles[i][j], i, j, halfBoard, tiles);
            tileSurface.translate.y -= tile.height * TILE_HEIGHT_AMNT;

            var tileHighlight = createTile("rgba(255, 0, 0, 0.8)", i, j, halfBoard, highlights, -1, false, 4); //TODO magic numbers ree
            tileHighlight.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            tileHighlight.visible = false;

            tileArr[i].push(tileSurface);
            highlightArr[i].push(tileHighlight);

            var tileGrass = addGrass(i, j, halfBoard, tiles, tileSurface.color, tile.grassDensity, tile.grassHeight, tile.grassHeightVariation, tile.optimizeGrass);
            tileGrass.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            grassArr[i].push(tileGrass);
        }
    }

    return { tiles, highlights, grass, tileArr, highlightArr, grassArr };
}

let board: Zdog.Illustration;
let layers: GridLayers;
let droneArr: Zdog.Anchor[] = [];
let game: GameState;

// Variables for rotation correction on drag release
let lastTimestamp = 0;
let wasDragged = true;
let nearestCorner = 0;
export function resetBoard(gameState: GameState, boardMgr: BoardManager)
{
    game = gameState;
    layers = initIllustration(game, boardMgr);
    remove_drones();
    nearestCorner = game.rotation;
}

function remove_drones()
{
    for(var i = 0; i < droneArr.length; ++i)
    {
        droneArr[i].remove();
    }
    droneArr = [];
}

function normalizeRotation(rot: number)
{
    return ((rot % Zdog.TAU) + Zdog.TAU) % Zdog.TAU;
}

export function drawBoard(gameState: GameState, boardMgr: BoardManager, modelStore: ModelStore)
{
    game = gameState;

    var canvas = document.getElementById("cvs_viewport") as HTMLCanvasElement;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    var ctx = canvas.getContext("2d");
    var halfBoard = ((game.tiles.length - 1) * TILE_SIZE / 2);

    layers = initIllustration(game, boardMgr);
    game = gameState;

    function draw(timestamp: number)
    {
        let delta = timestamp - lastTimestamp;

        // Update drones
        var refreshed = false;
        while(droneArr.length < game.drones.keys().length)
        {
            let newIndex = droneArr.length;
            let droneName = game.drones.keys()[newIndex];
            let newX = game.drones.get(droneName).posX;
            let newY = game.drones.get(droneName).posY;
            let newDrone = modelStore.get("drone", { translate: { x: newX, y: newY}, addTo: layers.grassArr[newX][newY]});
            newDrone.translate = {x: TILE_SIZE / 2, z: TILE_SIZE / 2}
            droneArr.push(newDrone);
            layers.grassArr[newX][newY].updateGraph();
            refreshed = true;
        }

        for(var i = 0; i < game.drones.keys().length; ++i)
        {
            let droneName = game.drones.keys()[i];
            if(game.drones.get(droneName).moved)
            {
                droneArr[i].remove(); 
                var x = game.drones.get(droneName).posX;
                var y = game.drones.get(droneName).posY;
    
                layers.grassArr[x][y].addChild(droneArr[i]);
                layers.grassArr[x][y].updateGraph();
                refreshed = true;
                game.drones.get(droneName).moved = false;
            }
        }

        if(refreshed)
        {
            layers.grass.updateGraph();
        }

        // Update dirty tiles
        for(var i = 0; i < game.dirtyTiles.length; ++i)
        {
            var pair = game.dirtyTiles[i];
            layers.tileArr[pair.x][pair.y].remove();
            layers.tileArr[pair.x][pair.y].visible = false;
            layers.grassArr[pair.x][pair.y].remove();
            layers.grassArr[pair.x][pair.y].visible = false;

            let tile = game.tiles[pair.x][pair.y];
            let newTile = createZdogTile(tile, pair.x, pair.y, halfBoard, layers.tiles);
            layers.tileArr[pair.x][pair.y] = newTile;

            let drone: Drone;
            for(let i = 0; i < game.drones.keys().length; ++i)
            {
                let name = game.drones.keys()[i];
                if(game.drones.get(name).posX == pair.x && game.drones.get(name).posY == pair.y)
                {
                    drone = game.drones.get(name);
                    break;
                }
            }

            layers.grassArr[pair.x][pair.y] = addGrass(pair.x, pair.y, halfBoard, layers.tiles, newTile.color, tile.grassDensity, tile.grassHeight, tile.grassHeightVariation, tile.optimizeGrass);
            if(drone) drone.moved = true;
        }

        if(game.dirtyTiles.length > 0)
        {
            layers.tiles.updateGraph();
        }

        game.dirtyTiles = [];

        // Update selections
        layers.highlightArr.map((arr: Array<Zdog.Anchor>) =>
        {
            arr.map((tile: any) => 
            {
                tile.visible = false;
            });
        });

        if(boardMgr.selectedTile.x != -1 && boardMgr.selectedTile.y != -1)
        {
            layers.highlightArr[boardMgr.selectedTile.x][boardMgr.selectedTile.y].visible = true;
        }

        // Correct if angle isn't perfect 45deg
        let CORRECTION_DELAY = 1000;
        if(!boardMgr.isDragged)
        {
            if(wasDragged)
            {
                let corner_offset = game.rotation % (Zdog.TAU / 4);

                nearestCorner = game.rotation - corner_offset + Zdog.TAU / 8;
                nearestCorner = normalizeRotation(nearestCorner);
                wasDragged = false;
            }

            if(Math.abs(game.rotation - nearestCorner) > 0.0001)
            {
                game.rotation = Zdog.lerp(game.rotation, nearestCorner, delta/100);
                game.rotation = normalizeRotation(game.rotation);
            }
            boardMgr.rotOffset = game.rotation;
            boardMgr.pitchOffset = game.pitch;
        }
        else
        {
            wasDragged = true;
        }

        // Rotate board to match game state
        board.zoom = game.zoom;
        board.rotate.x = game.pitch;
        board.rotate.y = game.rotation;

        board.updateRenderGraph();
        ctx.fillText("FPS: " + Math.round(1000/delta), 50, 50);
        ctx.fillText("Rotation: " + Math.round(game.rotation * 360 / Zdog.TAU), 50, 75);
        ctx.fillText("Nearest Corner: " + Math.round(nearestCorner * 360 / Zdog.TAU), 50, 100);
        //document.dispatchEvent(new event(game, delta));
        lastTimestamp = timestamp;
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

export { BoardManager };