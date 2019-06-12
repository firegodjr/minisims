import { Tiles } from "../constants.js";
import { make_pair, Table } from "../util/table.js";
var TILES = [Tiles.GRASS, Tiles.WATER];
var WATER_LEVEL_RANGES = [
    { tile: Tiles.ORE_RIPE, min: 0.75 },
    { tile: Tiles.STONE, min: 0.65 },
    { tile: Tiles.GRASS, min: 0.35 },
    { tile: Tiles.WATER, min: 0 }
];
var WATER_LEVEL_TABLE = new Table([
    make_pair(Tiles.ORE_RIPE, 0.75),
    make_pair(Tiles.STONE, 0.65),
    make_pair(Tiles.GRASS, 0.35),
    make_pair(Tiles.WATER, 0)
]);
var WHEAT_MIN = 0.65;
export function GenerateTiles(game, width, height, serial_tiles) {
    noise.seed(Math.random());
    var tiles = [];
    for (var i = 0; i < width; ++i) {
        tiles.push([]);
        for (var j = 0; j < height; ++j) {
            var water_level = (noise.perlin2((i + 1) / 8, (j + 1) / 8) + 1) / 2;
            for (var tl = 0; tl < WATER_LEVEL_RANGES.length; ++tl) {
                if (water_level > WATER_LEVEL_RANGES[tl].min) {
                    var new_tile = void 0;
                    // Create the tiles from serialized tiles if we can, otherwise generate them
                    if (serial_tiles) {
                        var type = serial_tiles[i][j].type;
                        var height_1 = serial_tiles[i][j].height;
                        new_tile = game.m_tile_creator.create(type);
                        if (WATER_LEVEL_TABLE.get(type)) {
                            new_tile.color.r += (height_1 + 0.35 - WATER_LEVEL_TABLE.get(type) - 0.5) * 80;
                            new_tile.color.g += (height_1 + 0.35 - WATER_LEVEL_TABLE.get(type) - 0.5) * 80;
                            new_tile.color.b += (height_1 + 0.35 - WATER_LEVEL_TABLE.get(type) - 0.5) * 80;
                        }
                        new_tile.height = height_1;
                    }
                    else {
                        new_tile = game.m_tile_creator.create(WATER_LEVEL_RANGES[tl].tile);
                        //new_tile.color.v = 0;
                        new_tile.color.r += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        new_tile.color.g += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        new_tile.color.b += (water_level - WATER_LEVEL_RANGES[tl].min - 0.5) * 80;
                        if (new_tile.type != Tiles.WATER) {
                            new_tile.height = water_level - 0.35;
                        }
                        else {
                            new_tile.height = WATER_LEVEL_RANGES[tl].min;
                        }
                    }
                    tiles[i].push(new_tile);
                    break;
                }
            }
            // Add wheat only if we're making this from scratch
            if (!serial_tiles) {
                var crop_noise = (noise.perlin2((i + 5) / 5, (j + 5) / 5) + 1) / 2;
                if (crop_noise > WHEAT_MIN) {
                    if (tiles[i][j].type == Tiles.GRASS) {
                        var height_2 = tiles[i][j].height;
                        tiles[i][j] = game.m_tile_creator.create(Tiles.WHEAT_RIPE);
                        tiles[i][j].height = height_2;
                    }
                }
            }
        }
    }
    game.m_tiles = tiles;
}
