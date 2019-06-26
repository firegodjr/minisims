using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTO;
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
        
        public TileMap(ITileGenerator tileGenerator)
        {
            tileArray = tileGenerator.GenerateTiles(16, 16);
        }

        public void Init(int width, int height, TileTypes fillTile)
        {
            tileArray = new Tile[width][];
            for(int x = 0; x < width; ++x)
            {
                tileArray[x] = new Tile[height];
                for(int y = 0; y < height; ++y)
                {
                    tileArray[x][y] = new Tile(fillTile, 0);
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

        public TileDTO[][] AsTileDTOArray()
        {
            TileDTO[][] tileDTOs = new TileDTO[tileArray.Length][];
            for(int x = 0; x < tileArray.Length; ++x)
            {
                tileDTOs[x] = new TileDTO[tileArray[x].Length];
                for(int y = 0; y < tileArray[x].Length; ++y)
                {
                    tileDTOs[x][y] = tileArray[x][y].AsDTO();
                }
            }

            return tileDTOs;
        }
    }
}
