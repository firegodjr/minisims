using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Pathing;
using MinisimsBackend.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map.Generation
{
    public class StaticMapGenerator : ITileGenerator
    {
        ILog _log;
        public StaticMapGenerator(ILog _log)
        {
            this._log = _log;
        }

        public Tile[][] GenerateTiles(int width, int height)
        {
            TileTypes[][] tiles = new TileTypes[][]
            {
                new TileTypes[] { TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS },
                new TileTypes[] { TileTypes.GRASS, TileTypes.WATER, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.WATER },
                new TileTypes[] { TileTypes.WATER, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.WATER, TileTypes.GRASS },
                new TileTypes[] { TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.WATER, TileTypes.WATER, TileTypes.GRASS },
                new TileTypes[] { TileTypes.GRASS, TileTypes.GRASS, TileTypes.WATER, TileTypes.WATER, TileTypes.GRASS, TileTypes.GRASS },
                new TileTypes[] { TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS, TileTypes.GRASS }
            };

            Tile[][] actualTiles = new Tile[tiles.Length][];
            for(int x = 0; x < tiles.Length; ++x)
            {
                actualTiles[x] = new Tile[tiles[x].Length];
                for(int y = 0; y < tiles[x].Length; ++y)
                {
                    actualTiles[x][y] = new Tile(tiles[x][y], 0);
                }
            }

            AStarPathFinder finder = new AStarPathFinder(new Log());
            LinkedList <Point> path = finder.FindBestPath(actualTiles, new Point(0, 0), new Point(tiles.Length - 1, tiles[0].Length - 1));
            var pathEnum = path.GetEnumerator();

            actualTiles[pathEnum.Current.x][pathEnum.Current.y] = new Tile(TileTypes.STONE, 0);
            while (pathEnum.MoveNext())
            {
                actualTiles[pathEnum.Current.x][pathEnum.Current.y] = new Tile(TileTypes.STONE, 0);
            }
            
            return actualTiles;
        }
    }
}
