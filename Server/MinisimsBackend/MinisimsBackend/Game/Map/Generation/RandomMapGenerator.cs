using MinisimsBackend.DI.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map.Generation
{
    public class RandomMapGenerator : ITileGenerator
    {
        public Tile[][] GenerateTiles(int width, int height)
        {
            Tile[][] tileArray = new Tile[width][];
            for (int x = 0; x < width; ++x)
            {
                tileArray[x] = new Tile[height];
                for (int y = 0; y < height; ++y)
                {
                    tileArray[x][y] = new Tile(TileTypes.GRASS, 0.5f);
                }
            }

            tileArray[5][5] = new Tile(TileTypes.WATER, 0.5f);

            return tileArray;
        }
    }
}
