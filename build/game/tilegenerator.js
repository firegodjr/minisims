import { Tiles } from "../constants.js";
var TILES = [Tiles.GRASS, Tiles.WATER];
var WATER_LEVEL_RANGES = [
    { tile: Tiles.ORE_RIPE, min: 0.75 },
    { tile: Tiles.STONE, min: 0.65 },
    { tile: Tiles.GRASS, min: 0.35 },
    { tile: Tiles.WATER, min: 0 }
];
var WHEAT_MIN = 0.65;
export function GenerateTiles(game, width, height) {
    noise.seed(Math.random());
    var tiles = [];
    for (var i = 0; i < width; ++i) {
        tiles.push([]);
        for (var j = 0; j < height; ++j) {
            var water_level = (noise.perlin2((i + 1) / 8, (j + 1) / 8) + 1) / 2;
            for (var tl = 0; tl < WATER_LEVEL_RANGES.length; ++tl) {
                if (water_level > WATER_LEVEL_RANGES[tl].min) {
                    tiles[i].push(game.m_tile_creator.create(WATER_LEVEL_RANGES[tl].tile));
                    break;
                }
            }
            var crop_noise = (noise.perlin2((i + 5) / 5, (j + 5) / 5) + 1) / 2;
            if (crop_noise > WHEAT_MIN) {
                if (tiles[i][j].type == Tiles.GRASS) {
                    tiles[i][j] = game.m_tile_creator.create(Tiles.WHEAT_RIPE);
                }
            }
        }
    }
    game.m_tiles = tiles;
}
