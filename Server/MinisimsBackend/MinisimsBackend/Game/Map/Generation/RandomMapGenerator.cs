using MinisimsBackend.DI.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map
{
    public class RandomMapGenerator : ITileGenerator
    {
        public void GenerateTiles(IGameState game, int width, int height)
        {
            Random random = new Random();
            int tileCount = Enum.GetValues(typeof(TileTypes)).Length;
            for (int x = 0; x < width; ++x)
            {
                for(int y = 0; y < height; ++y)
                {
                    TileTypes tile = (TileTypes)(random.Next() % tileCount);
                    game.Tiles.SetTile(x, y, tile);
                }
            }
        }
    }
}
