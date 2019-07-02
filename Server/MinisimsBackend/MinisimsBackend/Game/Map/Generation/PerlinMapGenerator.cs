using MinisimsBackend.DI.Abstractions;
using System;
using LibNoise.Primitive;
using LibNoise;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map.Generation
{
    public class PerlinMapGenerator : ITileGenerator
    {
        (TileTypes, float)[] HEIGHT_THRESHOLDS = new (TileTypes, float)[]
        {
            (TileTypes.ORE_RIPE, 0.85f),
            (TileTypes.STONE, 0.75f),
            (TileTypes.GRASS, 0.25f),
            (TileTypes.WATER, 0f)
        };

        const float WHEAT_MIN = 0.65f;

        public PerlinMapGenerator()
        {

        }

        public Tile[][] GenerateTiles(int width, int height)
        {
            int seed = (int)DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds;
            SimplexPerlin perlin = new SimplexPerlin(seed, NoiseQuality.Best);
            Tile[][] tiles = new Tile[width][];

            for(int x = 0; x < width; ++x)
            {
                tiles[x] = new Tile[height];
                for(int y = 0; y < height; ++y)
                {
                    float tileHeight = (perlin.GetValue(x / 16f, y / 16f) + 1) / 2;

                    for(int tl = 0; tl < HEIGHT_THRESHOLDS.Length; ++tl)
                    {
                        if(tileHeight >= HEIGHT_THRESHOLDS[tl].Item2)
                        {
                            Tile tile = new Tile(HEIGHT_THRESHOLDS[tl].Item1, tileHeight - 0.35f);
                            tiles[x][y] = tile;
                            break;
                        }
                    }

                    float cropNoise = perlin.GetValue((x + width * 3) / 8f, (y + width * 3) / 8f) + 1 / 2;

                    if(cropNoise > WHEAT_MIN)
                    {
                        if(tiles[x][y].TileType == TileTypes.GRASS)
                        {
                            tiles[x][y].TileType = TileTypes.WHEAT_RIPE;
                        }
                    }
                }
            }

            return tiles;
        }
    }
}
