import { Tiles } from "../constants.js";
import { GameState, Tile } from "../game/game.js";
declare var noise: any;

const TILES = [Tiles.GRASS, Tiles.WATER];
const WATER_LEVEL_RANGES = [
    { tile: Tiles.ORE_RIPE, min: 0.75 },
    { tile: Tiles.STONE, min: 0.65 },
    { tile: Tiles.GRASS, min: 0.35 },
    { tile: Tiles.WATER, min: 0 }
]

const WHEAT_MIN = 0.65;

export function GenerateTiles(game: GameState, width: number, height: number)
{
    noise.seed(Math.random());
    let tiles: Array<Array<Tile>> = [];
    for(var i = 0; i < width; ++i)
    {
        tiles.push([]);
        for(var j = 0; j < height; ++j)
        {
            var water_level = (noise.perlin2((i+1) / 8, (j+1) / 8) + 1) / 2;

            for(var tl = 0; tl < WATER_LEVEL_RANGES.length; ++tl)
            {
                if(water_level > WATER_LEVEL_RANGES[tl].min)
                {
                    let new_tile = game.m_tile_creator.create(WATER_LEVEL_RANGES[tl].tile);
                    //new_tile.color.v = 0;
                    new_tile.color.r += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                    new_tile.color.g += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                    new_tile.color.b += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                    if(new_tile.type != Tiles.WATER)
                    {
                        new_tile.height = water_level - 0.35;
                    }
                    else
                    {
                        new_tile.height = WATER_LEVEL_RANGES[tl].min;
                    }
                    
                    tiles[i].push(new_tile);
                    break;
                }
            }
            
            var crop_noise = (noise.perlin2((i+5) / 5, (j+5) / 5) + 1) / 2;

            if(crop_noise > WHEAT_MIN)
            {
                if(tiles[i][j].type == Tiles.GRASS)
                {
                    let height = tiles[i][j].height;
                    tiles[i][j] = game.m_tile_creator.create(Tiles.WHEAT_RIPE);
                    tiles[i][j].height = height;
                }
            }
        }
    }

    game.m_tiles = tiles;
}