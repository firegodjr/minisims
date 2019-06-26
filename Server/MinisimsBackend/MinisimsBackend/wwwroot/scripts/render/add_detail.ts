import { Tile } from "../game/game.js";
import { Zdog } from '../zDog/zdog.js';
import { TILE_SIZE } from "./render.js";
declare var Zdog: Zdog;

function addDetail(x: number, y: number, half_board: number, anchor: Zdog.Anchor, color: string, stroke: number = 4, density: number = 20, height = 20, heightVariation = 1, heightOffsetX = 0, heightOffsetZ = 0, randomVariation = false, optimize = true)
{
    var rootPos = getTilePos(x, y, half_board);
    rootPos.x -= TILE_SIZE / 2;
    rootPos.z -= TILE_SIZE / 2;
    var path = [];
    for (var i = 0; i < density; ++i)
    {
        for (var j = 0; j < density; ++j)
        {
            if (optimize && !randomVariation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2))
            {
                continue;
            }
            var variationX = Math.random() * 0.5 * TILE_SIZE / density;
            var variationZ = Math.random() * 0.5 * TILE_SIZE / density;
            var posX;
            var posY = -stroke / 2;
            var posZ;
            if (randomVariation)
            {
                posX = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                posZ = Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
            }
            else
            {
                posX = variationX + Zdog.lerp(0, TILE_SIZE, i / density);
                posZ = variationZ + Zdog.lerp(0, TILE_SIZE, j / density);
            }
            path.push({
                move: {
                    x: posX,
                    y: posY,
                    z: posZ
                }
            }, {
                    line: {
                        x: posX + heightOffsetX,
                        y: posY + Math.random() * heightVariation * height - height,
                        z: posZ + heightOffsetZ
                    }
                });
        }
    }
    var grassContainer = new Zdog.Group({
        addTo: anchor,
        translate: { x: rootPos.x, z: rootPos.z }
    });
    new Zdog.Shape({
        addTo: grassContainer,
        stroke: stroke,
        color: color,
        visible: path.length == 0 ? false : true,
        path: path.length == 0 ? [{ move: { x: 0, y: 0, z: 0 } }] : path
    });
    return grassContainer;
}
export function addGrass(x: number, y: number, half_board: number, anchor: Zdog.Anchor, color: string, density: number = 20, height: number = 20, variation: number = 1, optimize: boolean = true)
{
    return addDetail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
}
function addMineral(x: number, y: number, half_board: number, anchor: any, color: string, density: number)
{
    return addDetail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
}
function getTilePos(x: number, y: number, half_board: number)
{
    return { x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board };
}
export function createZdogTile(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return createTile(tile.getColor(), x, y, half_board, anchor, tile.type, true, 1, false);
}
function createGrassFromTile(tile: Tile, x: number, y: number, half_board: number, anchor: any)
{
    return addGrass(x, y, half_board, anchor, tile.grassColor, tile.grassDensity, tile.grassHeight, tile.grassHeightVariation, tile.optimizeGrass);
}
export function createTile(color: string, x: number, y: number, halfBoard: number, anchor: any, tileType: number = -1, fill: boolean = true, stroke: number = 1, box: boolean = false)
{
    let tileSurface;
    tileSurface = new Zdog.Rect({
        addTo: anchor,
        color: color,
        width: TILE_SIZE,
        height: TILE_SIZE,
        stroke: stroke,
        fill: fill,
        translate: getTilePos(x, y, halfBoard),
        rotate: { x: Zdog.TAU / 4 }
    });
    return tileSurface;
}
