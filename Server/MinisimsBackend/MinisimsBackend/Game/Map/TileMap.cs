using MinisimsBackend.DI.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map
{
    public class TileMap : ITileMap
    {
        public Tile[][] TileArray { get => tileArray; }
        private Tile[][] tileArray { get; set; }

        public void Init(int width, int height, Tile fillTile)
        {
            tileArray = new Tile[width][];
            for(int x = 0; x < width; ++x)
            {
                tileArray[x] = new Tile[height];
                for(int y = 0; y < height; ++y)
                {
                    tileArray[x][y] = fillTile;
                }
            }
        }

        public void SetTile(int x, int y, TileTypes type, float height)
        {
            tileArray[x][y].TileType = type;
            tileArray[x][y].Height = height;
        }

        public void SetTile(int x, int y, Tile tile)
        {
            tileArray[x][y] = tile;
        }

        public void SetTile(int x, int y, TileTypes type)
        {
            tileArray[x][y].TileType = type;
        }

        public TileMap()
        {
            
        }
    }
}
