import { Tiles } from "../constants.js";
import { Table } from "../util/table.js";
import { GameState, ICoords, TileCreator } from "../game/game.js";
import { Coords } from "../game/game.js";
import { ModelStore, json_to_zdog } from "./models.js";
import { ZdogTypes } from '../zDog/zdog';
import { create_tile_from_object, create_tile, add_grass } from "./add_detail.js";
export declare var Zdog: any;

export const TILE_SIZE = 40;
const GRASS_THRESHOLD = 0.5;

/**
 * An object containing references to the scene layers and the tiles that make them up
 */
interface GridLayers
{
    tiles: ZdogTypes.ZdogGroup;
    highlights: ZdogTypes.ZdogGroup;
    grass: ZdogTypes.ZdogGroup;
    tileArr: ZdogTypes.ZdogShape[][];
    highlightArr: ZdogTypes.ZdogShape[][];
    grassArr: ZdogTypes.ZdogGroup[][];
}

/**
 * Manages functionality and interactivity of the canvas game board, synchronizing it with the gamestate for ease of access
 */
class BoardManager
{
    rot_offset: number;
    rot_buf: number;
    pitch_offset: number;
    pitch_buf: number;
    selected_tile: ICoords;
    is_dragged: boolean;
    game: GameState;

    /**
     * 
     * @param game The gamestate to save rotation values to
     */
    constructor(game: GameState)
    {
        this.rot_offset = Zdog.TAU * 7 / 8;
        this.rot_buf = 0;
        this.pitch_offset = -Zdog.TAU / 12;
        this.pitch_buf = 0;
        this.selected_tile = new Coords(-1, -1);
        this.game = game;
    }

    /**
     * Handler for the Zdog dragStart event
     * @param pointer Mouse pointer coordinates
     */
    dragStart(pointer: ICoords)
    {
        this.is_dragged = true;
    }

    /**
     * Handler for the Zdog dragMove event
     * @param pointer Mouse pointer coordinates
     * @param moveX Total amount of x movement in this drag
     * @param moveY Total amount of y movement in this drag
     */
    dragMove(pointer: ICoords, moveX: number, moveY: number)
    {
        this.game.m_pitch = Math.max(
            -Zdog.TAU / 5, Math.min(
                -Zdog.TAU / 20, -Zdog.TAU * moveY / 2000 + this.pitch_offset
                ));
        this.pitch_buf = this.game.m_pitch;

        this.game.m_rotation = -Zdog.TAU * moveX / 1000 + this.rot_offset;
        this.game.m_rotation = normalize_rotation(this.game.m_rotation);
        this.rot_buf = this.game.m_rotation;
    }

    /**
     * Handler for the Zdog dragEnd event
     */
    dragEnd()
    {
        this.rot_offset = this.game.m_rotation % Zdog.TAU;
        this.pitch_offset = this.game.m_pitch;
        this.game.m_rotation = normalize_rotation(this.game.m_rotation);
        this.is_dragged = false;
    }

    /**
     * Selects a game tile
     * @param x X coordinate of the tile
     * @param y Y coordinate of the tile
     */
    selectTile(x: number, y: number)
    {
        this.selected_tile = new Coords(x, y);
    }
}

function init_illustration(game: GameState, board_mgr: BoardManager): GridLayers
{
    var half_board = ((game.m_tiles.length - 1) * TILE_SIZE / 2);

    if(!board) // Reuse existing illustration if possible, because draggable objects can't be garbage-collected
    {
        board = new Zdog.Illustration({
            element: "#cvs_viewport",
            color: "rgb(110, 210, 190)",
            resize: true,
            dragRotate: true,
            onDragStart: (p: ICoords) => board_mgr.dragStart(p),
            onDragMove: (p: ICoords, mx: number, my: number) => board_mgr.dragMove(p, mx, my),
            onDragEnd: () => board_mgr.dragEnd(),
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

    for(var i = 0; i < game.m_tiles.length; ++i)
    {
        const TILE_HEIGHT_AMNT = TILE_SIZE * 0;

        tileArr.push([]);
        highlightArr.push([]);
        grassArr.push([]);
        for(var j = 0; j < game.m_tiles[i].length; ++j)
        {
            var tile = game.m_tiles[i][j];
            var tile_surface = create_tile_from_object(game.m_tiles[i][j], i, j, half_board, tiles);
            tile_surface.translate.y -= tile.height * TILE_HEIGHT_AMNT;

            var tile_highlight = create_tile("rgba(255, 0, 0, 0.8)", i, j, half_board, highlights, -1, false, 4); // magic numbers ree
            tile_highlight.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            tile_highlight.visible = false;

            tileArr[i].push(tile_surface);
            highlightArr[i].push(tile_highlight);

            var tile_grass = add_grass(i, j, half_board, tiles, tile_surface.color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
            tile_grass.translate.y -= tile.height * TILE_HEIGHT_AMNT;
            grassArr[i].push(tile_grass);
        }
    }

    return { tiles, highlights, grass, tileArr, highlightArr, grassArr };
}

let board: ZdogTypes.ZdogIllustration;
let layers: GridLayers;
let droneArr: ZdogTypes.ZdogAnchor[] = [];
let game: GameState;

// Variables for rotation correction on drag release
let last_timestamp = 0;
let was_dragged = true;
let nearest_corner = 0;
export function reset_board(game_state: GameState, board_mgr: BoardManager)
{
    game = game_state;
    layers = init_illustration(game, board_mgr);
    remove_drones();
    nearest_corner = game.m_rotation;
}

function remove_drones()
{
    for(var i = 0; i < droneArr.length; ++i)
    {
        droneArr[i].remove();
    }
    droneArr = [];
}

function normalize_rotation(rot: number)
{
    return ((rot % Zdog.TAU) + Zdog.TAU) % Zdog.TAU;
}

export function draw_board(game_state: GameState, board_mgr: BoardManager, model_store: ModelStore)
{
    game = game_state;

    var canvas = document.getElementById("cvs_viewport") as HTMLCanvasElement;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    var ctx = canvas.getContext("2d");
    var half_board = ((game.m_tiles.length - 1) * TILE_SIZE / 2);

    layers = init_illustration(game, board_mgr);
    game = game_state;

    function draw(timestamp: number)
    {
        let delta = timestamp - last_timestamp;

        // Update drones
        var refreshed = false;
        while(droneArr.length < game.m_drones.length)
        {
            let new_index = droneArr.length;
            let new_x = game.m_drones[new_index].m_pos_x;
            let new_y = game.m_drones[new_index].m_pos_y;
            let new_drone = model_store.get("drone", { translate: { x: new_x, y: new_y}, addTo: layers.grassArr[new_x][new_y]});
            new_drone.translate = {x: TILE_SIZE / 2, z: TILE_SIZE / 2}
            droneArr.push(new_drone);
            layers.grassArr[new_x][new_y].updateGraph();
            refreshed = true;
        }

        for(var i = 0; i < game.m_drones.length; ++i)
        {
            if(game.m_drones[i].m_moved)
            {
                droneArr[i].remove(); 
                var x = game.m_drones[i].m_pos_x;
                var y = game.m_drones[i].m_pos_y;
    
                layers.grassArr[x][y].addChild(droneArr[i]);
                layers.grassArr[x][y].updateGraph();
                refreshed = true;
            }
        }

        if(refreshed)
        {
            layers.grass.updateGraph();
        }

        // Update dirty tiles
        for(var i = 0; i < game.m_dirty_tiles.length; ++i)
        {
            var pair = game.m_dirty_tiles[i];
            layers.tileArr[pair.x][pair.y].remove();
            layers.tileArr[pair.x][pair.y].visible = false;
            layers.grassArr[pair.x][pair.y].remove();
            layers.grassArr[pair.x][pair.y].visible = false;

            let newTile = create_tile_from_object(game.m_tiles[pair.x][pair.y], pair.x, pair.y, half_board, layers.tiles);
            layers.tileArr[pair.x][pair.y] = newTile

            layers.grassArr[pair.x][pair.y] = add_grass(pair.x, pair.y, half_board, layers.grass, newTile.color, newTile.grass_density, newTile.grass_height, newTile.grass_height_variation, newTile.optimize_grass);
        }
        if(game.m_dirty_tiles.length > 0)
        {
            layers.tiles.updateGraph();
            layers.grass.updateGraph();
        }
        game.m_dirty_tiles = [];

        // Update selections
        layers.highlightArr.map((arr: Array<ZdogTypes.ZdogAnchor>) =>
        {
            arr.map((tile: any) => 
            {
                tile.visible = false;
            });
        });

        if(board_mgr.selected_tile.x != -1 && board_mgr.selected_tile.y != -1)
        {
            layers.highlightArr[board_mgr.selected_tile.x][board_mgr.selected_tile.y].visible = true;
        }

        // Correct if angle isn't perfect 45deg
        let CORRECTION_DELAY = 1000;
        if(!board_mgr.is_dragged)
        {
            if(was_dragged)
            {
                let corner_offset = game.m_rotation % (Zdog.TAU / 4);

                nearest_corner = game.m_rotation - corner_offset + Zdog.TAU / 8;
                nearest_corner = normalize_rotation(nearest_corner);
                was_dragged = false;
            }

            if(Math.abs(game.m_rotation - nearest_corner) > 0.0001)
            {
                game.m_rotation = Zdog.lerp(game.m_rotation, nearest_corner, delta/100);
                game.m_rotation = normalize_rotation(game.m_rotation);
            }
            board_mgr.rot_offset = game.m_rotation;
            board_mgr.pitch_offset = game.m_pitch;
        }
        else
        {
            was_dragged = true;
        }

        // Rotate board to match game state
        board.zoom = game.m_zoom;
        board.rotate.x = game.m_pitch;
        board.rotate.y = game.m_rotation;

        board.updateRenderGraph();
        ctx.fillText("FPS: " + 1000/delta, 50, 50);
        ctx.fillText("Rotation: " + (game.m_rotation * 360 / Zdog.TAU), 50, 75);
        ctx.fillText("Nearest Corner: " + (nearest_corner * 360 / Zdog.TAU), 50, 100);
        //document.dispatchEvent(new event(game, delta));
        last_timestamp = timestamp;
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

export { BoardManager };