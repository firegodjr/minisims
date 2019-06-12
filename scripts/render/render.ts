import { Tiles } from "../constants.js";
import { Table } from "../util/table.js";
import { GameState, ICoords, Tile, TileCreator } from "../game/game.js";
import { Coords } from "../game/game.js";
import { ModelStore, json_to_zdog } from "./models.js";
import { Zdog, ZdogTypes } from '../zDog/zdog';
declare var Zdog: any;

const TILE_SIZE = 40;
const GRASS_THRESHOLD = 0.5;

interface IVariedColor
{
    r: number,
    g: number,
    b: number,
    v?: number
}

enum GrassColorType
{
    Inherit,
    Custom
}

function add_detail(x: number, y: number, half_board: number, anchor: ZdogTypes.ZdogAnchor, color: string, stroke: number = 4, density: number = 20, height = 20, height_variation = 1, height_offset_x = 0, height_offset_z = 0, random_variation = false, optimize = true)
{
    var root_pos = get_tile_pos(x, y, half_board);
    root_pos.x -= TILE_SIZE/2;
    root_pos.z -= TILE_SIZE/2;
    var path = [];
    for(var i = 0; i < density; ++i)
    {
        for(var j = 0; j < density; ++j)
        {
            if(optimize && !random_variation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2))
            {
                continue;
            }

            var x_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var z_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var pos_x;
            var pos_y = -stroke/2;
            var pos_z;

            if(random_variation)
            {
                pos_x = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                pos_z = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
            }
            else
            {
                pos_x = x_variation + Zdog.lerp(0, TILE_SIZE, i/density);
                pos_z = z_variation + Zdog.lerp(0, TILE_SIZE, j/density);
            }

            path.push({
                move: {
                    x: pos_x,
                    y: pos_y,
                    z: pos_z
                }
            },
            {
                line: {
                    x: pos_x + height_offset_x,
                    y: pos_y + Math.random() * height_variation * height - height,
                    z: pos_z + height_offset_z
                }
            });
        }
    }

    var grass_container = new Zdog.Group({
        addTo: anchor,
        translate: {x: root_pos.x, z: root_pos.z }
    })
    
    new Zdog.Shape({
        addTo: grass_container,
        stroke: stroke,
        color: color,
        visible: path.length == 0 ? false : true,
        path: path.length == 0 ? [{move: {x: 0, y: 0, z: 0}}] : path
    });

    return grass_container;
}

function add_grass(x: number, y: number, half_board: number, anchor: ZdogTypes.ZdogAnchor, color: string, density: number = 20, height: number = 20, variation: number = 1, optimize: boolean = true)
{
    return add_detail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
}

function add_mineral(x: number, y: number, half_board: number, anchor: any, color: string, density: number)
{
    return add_detail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
}

function get_tile_pos(x: number, y: number, half_board: number)
{
    return {x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board};
}

function create_tile_from_object(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return create_tile(tile.get_color(), x, y, half_board, anchor, tile.type, true, 1, false);
}

function create_grass_from_tile(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return add_grass(x, y, half_board, anchor, tile.grass_color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
}

function create_tile(color: string, x: number, y: number, half_board: number, anchor: any, tileType: number = -1, fill: boolean = true, stroke: number = 1, box: boolean = false)
{
    let tile_surface;

    tile_surface = new Zdog.Rect({
        addTo: anchor,
        color: color,
        width: TILE_SIZE,
        height: TILE_SIZE,
        stroke: stroke,
        fill: fill,
        translate: get_tile_pos(x, y, half_board),
        rotate: { x: Zdog.TAU / 4 }
    });

    return tile_surface;
}

class BoardManager
{
    rot_offset: number;
    rot_buf: number;
    pitch_offset = -Zdog.TAU / 12;
    pitch_buf = 0;
    selected_tile: ICoords;
    is_dragged: boolean;
    game: GameState;

    constructor(game: GameState)
    {
        this.rot_offset = Zdog.TAU * 7 / 8;
        this.rot_buf = 0;
        this.pitch_offset = -Zdog.TAU / 12;
        this.pitch_buf = 0;
        this.selected_tile = new Coords(-1, -1);
        this.game = game;
    }

    dragStart(pointer: ICoords)
    {
        this.is_dragged = true;
    }

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

    dragEnd()
    {
        this.rot_offset = this.game.m_rotation % Zdog.TAU;
        this.pitch_offset = this.game.m_pitch;
        this.game.m_rotation = normalize_rotation(this.game.m_rotation);
        this.is_dragged = false;
    }

    selectTile(x: number, y: number)
    {
        this.selected_tile = new Coords(x, y);
    }
}

interface GridLayers
{
    tiles: ZdogTypes.ZdogGroup;
    highlights: ZdogTypes.ZdogGroup;
    grass: ZdogTypes.ZdogGroup;
    tileArr: ZdogTypes.ZdogShape[][];
    highlightArr: ZdogTypes.ZdogShape[][];
    grassArr: ZdogTypes.ZdogGroup[][];
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
let release_timestamp = 0;
let release_rotation = 0;
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
                release_timestamp = timestamp;
                release_rotation = game.m_rotation;

                let corner_offset = game.m_rotation % (Zdog.TAU / 4);

                nearest_corner = game.m_rotation - corner_offset + Zdog.TAU / 8;
                nearest_corner = normalize_rotation(nearest_corner);
                was_dragged = false;
            }

            if(Math.abs(game.m_rotation - nearest_corner) > 0.0001)
            {
                game.m_rotation = Zdog.lerp(game.m_rotation, nearest_corner, 0.4);
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