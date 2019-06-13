import { Tile } from "../game/game.js";
import { Zdog } from '../zDog/zdog.js';
import { TILE_SIZE } from "./render.js";
declare var Zdog: Zdog;

function add_detail(x: number, y: number, half_board: number, anchor: Zdog.Anchor, color: string, stroke: number = 4, density: number = 20, height = 20, height_variation = 1, height_offset_x = 0, height_offset_z = 0, random_variation = false, optimize = true)
{
    var root_pos = get_tile_pos(x, y, half_board);
    root_pos.x -= TILE_SIZE / 2;
    root_pos.z -= TILE_SIZE / 2;
    var path = [];
    for (var i = 0; i < density; ++i)
    {
        for (var j = 0; j < density; ++j)
        {
            if (optimize && !random_variation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2))
            {
                continue;
            }
            var x_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var z_variation = Math.random() * 0.5 * TILE_SIZE / density;
            var pos_x;
            var pos_y = -stroke / 2;
            var pos_z;
            if (random_variation)
            {
                pos_x = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                pos_z = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
            }
            else
            {
                pos_x = x_variation + Zdog.lerp(0, TILE_SIZE, i / density);
                pos_z = z_variation + Zdog.lerp(0, TILE_SIZE, j / density);
            }
            path.push({
                move: {
                    x: pos_x,
                    y: pos_y,
                    z: pos_z
                }
            }, {
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
        translate: { x: root_pos.x, z: root_pos.z }
    });
    new Zdog.Shape({
        addTo: grass_container,
        stroke: stroke,
        color: color,
        visible: path.length == 0 ? false : true,
        path: path.length == 0 ? [{ move: { x: 0, y: 0, z: 0 } }] : path
    });
    return grass_container;
}
export function add_grass(x: number, y: number, half_board: number, anchor: Zdog.Anchor, color: string, density: number = 20, height: number = 20, variation: number = 1, optimize: boolean = true)
{
    return add_detail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
}
function add_mineral(x: number, y: number, half_board: number, anchor: any, color: string, density: number)
{
    return add_detail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
}
function get_tile_pos(x: number, y: number, half_board: number)
{
    return { x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board };
}
export function create_tile_from_object(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return create_tile(tile.get_color(), x, y, half_board, anchor, tile.type, true, 1, false);
}
function create_grass_from_tile(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return add_grass(x, y, half_board, anchor, tile.grass_color, tile.grass_density, tile.grass_height, tile.grass_height_variation, tile.optimize_grass);
}
export function create_tile(color: string, x: number, y: number, half_board: number, anchor: any, tileType: number = -1, fill: boolean = true, stroke: number = 1, box: boolean = false)
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
