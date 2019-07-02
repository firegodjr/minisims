using MinisimsBackend.Game.AI.Pathing;
using MinisimsBackend.Game.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IPathFinder
    {
        LinkedList<Point> FindBestPath(Tile[][] map, Point start, Point end);
    }
}
