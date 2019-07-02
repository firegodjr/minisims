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
        public Tile[][] TileArray { get; private set; }
        private Dictionary<TileTypes, List<Point>> tileLocations;

        
        public TileMap(ITileGenerator tileGenerator)
        {
            tileLocations = new Dictionary<TileTypes, List<Point>>();

            TileArray = tileGenerator.GenerateTiles(16, 16);
            for(int x = 0; x < TileArray.Length; ++x)
            {
                for(int y = 0; y < TileArray[x].Length; ++y)
                {
                    if(!tileLocations.ContainsKey(TileArray[x][y].TileType))
                    {
                        tileLocations.Add(TileArray[x][y].TileType, new List<Point>());
                    }

                    tileLocations[TileArray[x][y].TileType].Add(new Point(x, y));
                }
            }
        }

        public void Init(int width, int height, TileTypes fillTile)
        {
            TileArray = new Tile[width][];
            for(int x = 0; x < width; ++x)
            {
                TileArray[x] = new Tile[height];
                for(int y = 0; y < height; ++y)
                {
                    TileArray[x][y] = new Tile(fillTile, 0);
                }
            }
        }

        public void SetTile(int x, int y, TileTypes type, float height)
        {
            TileArray[x][y].TileType = type;
            TileArray[x][y].Height = height;
        }

        public void SetTile(int x, int y, Tile tile)
        {
            TileArray[x][y] = tile;
        }

        public void SetTile(int x, int y, TileTypes type)
        {
            TileArray[x][y].TileType = type;
        }

        public Tile GetTileAt(Point point)
        {
            return TileArray[point.x][point.y];
        }

        public TileDTO[][] AsTileDTOArray()
        {
            TileDTO[][] tileDTOs = new TileDTO[TileArray.Length][];
            for(int x = 0; x < TileArray.Length; ++x)
            {
                tileDTOs[x] = new TileDTO[TileArray[x].Length];
                for(int y = 0; y < TileArray[x].Length; ++y)
                {
                    tileDTOs[x][y] = TileArray[x][y].AsDTO();
                }
            }

            return tileDTOs;
        }

        public Point[] GetTileLocations(TileTypes type)
        {
            return tileLocations[type].ToArray();
        }
    }
}
