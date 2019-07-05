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
            do
            {
                tileLocations = new Dictionary<TileTypes, List<Point>>();
                TileArray = tileGenerator.GenerateTiles(16, 16);
                for (int x = 0; x < TileArray.Length; ++x)
                {
                    for (int y = 0; y < TileArray[x].Length; ++y)
                    {
                        if (!tileLocations.ContainsKey(TileArray[x][y].TileType))
                        {
                            tileLocations.Add(TileArray[x][y].TileType, new List<Point>());
                        }

                        tileLocations[TileArray[x][y].TileType].Add(new Point(x, y));
                    }
                }
            }
            while (!tileLocations.ContainsKey(TileTypes.WHEAT_RIPE)); // if no wheat, try again
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

        public void SetTile(int x, int y, TileTypes newTile, float height)
        {
            TileTypes oldTile = TileArray[x][y].TileType;
            TileArray[x][y].TileType = newTile;
            TileArray[x][y].Height = height;

            tileLocations[oldTile].Remove(new Point(x, y));
            if (!tileLocations.TryAdd(newTile, new List<Point>(new Point[]{ new Point(x, y) })))
            {
                tileLocations[newTile].Add(new Point(x, y));
            }
        }

        public void SetTile(int x, int y, Tile tile)
        {
            TileTypes oldTile = TileArray[x][y].TileType;
            TileTypes newTile = tile.TileType;
            TileArray[x][y] = tile;

            tileLocations[oldTile].Remove(new Point(x, y));
            if (!tileLocations.TryAdd(newTile, new List<Point>(new Point[] { new Point(x, y) })))
            {
                tileLocations[newTile].Add(new Point(x, y));
            }
        }

        public void SetTile(int x, int y, TileTypes newTile)
        {
            TileTypes oldTile = TileArray[x][y].TileType;
            TileArray[x][y].TileType = newTile;

            tileLocations[oldTile].Remove(new Point(x, y));
            if (!tileLocations.TryAdd(newTile, new List<Point>(new Point[] { new Point(x, y) })))
            {
                tileLocations[newTile].Add(new Point(x, y));
            }
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
            if(tileLocations.ContainsKey(type))
            {
                return tileLocations[type].ToArray();
            }
            else
            {
                return new Point[0];
            }
        }
    }
}
