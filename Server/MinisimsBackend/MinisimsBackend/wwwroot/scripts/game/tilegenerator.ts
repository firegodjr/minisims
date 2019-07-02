import { TileTypes } from "../constants.js";
import { GameState, Tile, SerialTile } from "../game/game.js";
import { makePair, Table } from "../util/table.js";
declare var noise: any;

const TILES = [TileTypes.GRASS, TileTypes.WATER];
const WATER_LEVEL_RANGES = [
    { tile: TileTypes.ORE_RIPE, min: 0.85 },
    { tile: TileTypes.STONE, min: 0.75 },
    { tile: TileTypes.GRASS, min: 0.25 },
    { tile: TileTypes.WATER, min: 0 }
]

const WATER_LEVEL_TABLE = new Table([
    makePair(TileTypes.ORE_RIPE, 0.75),
    makePair(TileTypes.STONE, 0.65),
    makePair(TileTypes.GRASS, 0.35),
    makePair(TileTypes.WATER, 0)
]);

const WHEAT_MIN = 0.65;

export function GenerateTiles(game: GameState, width: number, height: number, serial_tiles?: SerialTile[][])
{
    noise.seed(Math.random());
    let tiles: Array<Array<Tile>> = [];
    for(var i = 0; i < width; ++i)
    {
        tiles.push([]);
        for(var j = 0; j < height; ++j)
        {
            var waterLevel = (noise.perlin2((i+1) / 8, (j+1) / 8) + 1) / 2;

            for(var tl = 0; tl < WATER_LEVEL_RANGES.length; ++tl)
            {
                if(waterLevel > WATER_LEVEL_RANGES[tl].min)
                {
                    let new_tile;

                    // Create the tiles from serialized tiles if we can, otherwise generate them
                    if(serial_tiles)
                    {
                        let type = serial_tiles[i][j].type;
                        let height = serial_tiles[i][j].height;
                        new_tile = game.tileCreator.create(type);
                        
                        if(WATER_LEVEL_TABLE.get(type))
                        {
                            new_tile.color.r += (height + 0.35 - WATER_LEVEL_TABLE.get(type)- 0.5) * 80;
                            new_tile.color.g += (height + 0.35 - WATER_LEVEL_TABLE.get(type)- 0.5) * 80;
                            new_tile.color.b += (height + 0.35 - WATER_LEVEL_TABLE.get(type)- 0.5) * 80;
                        }
                        new_tile.height = height;
                    }
                    else
                    {
                        new_tile = game.tileCreator.create(WATER_LEVEL_RANGES[tl].tile);
                    
                        //new_tile.color.v = 0;
                        new_tile.color.r += (waterLevel - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        new_tile.color.g += (waterLevel - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        new_tile.color.b += (waterLevel - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        if(new_tile.type != TileTypes.WATER)
                        {
                            new_tile.height = waterLevel - 0.35;
                        }
                        else
                        {
                            new_tile.height = WATER_LEVEL_RANGES[tl].min;
                        }
                    }
                    
                    tiles[i].push(new_tile);
                    break;
                }
            }
            
            // Add wheat only if we're making this from scratch
            if(!serial_tiles)
            {
                var crop_noise = (noise.perlin2((i+5) / 5, (j+5) / 5) + 1) / 2;

                if(crop_noise > WHEAT_MIN)
                {
                    if(tiles[i][j].type == TileTypes.GRASS)
                    {
                        let height = tiles[i][j].height;
                        tiles[i][j] = game.tileCreator.create(TileTypes.WHEAT_RIPE);
                        tiles[i][j].height = height;
                    }
                }
            }
        }
    }

    game.tiles = tiles;
}