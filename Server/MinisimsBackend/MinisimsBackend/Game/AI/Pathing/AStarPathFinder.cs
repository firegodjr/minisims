using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI.Pathing
{
    public class AStarPathFinder : IPathFinder
    {
        ILog _log;
        public AStarPathFinder(ILog log)
        {
            _log = log;
        }

        private float GetTileWeight(TileTypes tile, bool isDiag)
        {
            float mult = (float)(isDiag ? Math.Sqrt(2) : 1);
            switch(tile)
            {
                case TileTypes.WATER:
                    return 5 * mult;
                default:
                    return 1 * mult;
            }
        }

        private int GetHeuristic(Point start, Point end)
        {
            return (int)Math.Sqrt(Math.Pow(start.x - end.x, 2) + Math.Pow(start.y - end.y, 2));
        }

        private PathNode GetNeighbor(Tile[][] map, PathNode start, Direction direction)
        {
            Point offsetPoint = new Point(0, 0);
            bool isDiagonal = false;

            switch (direction)
            {
                case Direction.NORTH:
                    offsetPoint.y = 1;
                    break;

                case Direction.NORTHEAST:
                    offsetPoint.x = 1;
                    offsetPoint.y = 1;
                    isDiagonal = true;
                    break;

                case Direction.NORTHWEST:
                    offsetPoint.x = -1;
                    offsetPoint.y = 1;
                    isDiagonal = true;
                    break;

                case Direction.EAST:
                    offsetPoint.x = 1;
                    break;

                case Direction.WEST:
                    offsetPoint.x = -1;
                    break;

                case Direction.SOUTH:
                    offsetPoint.y = -1;
                    break;

                case Direction.SOUTHEAST:
                    offsetPoint.x = 1;
                    offsetPoint.y = -1;
                    isDiagonal = true;
                    break;

                default: //Direction.SOUTHWEST
                    offsetPoint.x = -1;
                    offsetPoint.y = -1;
                    isDiagonal = true;
                    break;
            }

            Point offsetStart = new Point(start.x + offsetPoint.x, start.y + offsetPoint.y);
            if(offsetStart.x >= 0 && offsetStart.x < map.Length)
                if (offsetStart.y >= 0 && offsetStart.y < map.Length)
                    return new PathNode(offsetStart.x, offsetStart.y, GetTileWeight(map[offsetStart.x][offsetStart.y].TileType, isDiagonal));

            return null;
        }

        private LinkedList<Point> ReconstructPath(Dictionary<Point, Point> cameFrom, PathNode current)
        {
            LinkedList<Point> path = new LinkedList<Point>();

            Point currPoint = current.point;
            path.AddFirst(currPoint);

            while (cameFrom.ContainsKey(currPoint))
            {
                currPoint = cameFrom[currPoint];
                path.AddFirst(currPoint);
            }

            return path;
        }

        public LinkedList<Point> FindBestPath(Tile[][] map, Point start, Point end)
        {
            // Map of points and the most efficient way to get to them
            Dictionary<Point, Point> cameFrom = new Dictionary<Point, Point>();
            // Map of non-heuristic scores for each point
            Dictionary<Point, float> gScore = new Dictionary<Point, float>();
            // Minheap of nodes to process
            PriorityQueue<PathNode> knownNodes = new PriorityQueue<PathNode>();
            // List of nodes we've already processed
            List<Point> processedNodes = new List<Point>();
            
            gScore.Add(start, 0);
            knownNodes.Enqueue(new PathNode(start.x, start.y, 0));
            
            while(knownNodes.Count > 0)
            {
                PathNode current = knownNodes.Dequeue();
                if (current.x == end.x && current.y == end.y)
                {
                    // We've reached the end node, return the path we found
                    return ReconstructPath(cameFrom, current);
                }

                // Filter out nodes we've already processed
                if (processedNodes.Contains(current.point))
                    continue;

                processedNodes.Add(current.point);

                for (int i = 0; i < 8; ++i)
                {
                    PathNode adjacent = GetNeighbor(map, current, (Direction)i);
                    if (adjacent == null)
                        continue;

                    // Filter out nodes we've already processed
                    if (processedNodes.Contains(adjacent.point))
                        continue;

                    float distance = gScore[current.point] + adjacent.dist;
                    
                    if(gScore.ContainsKey(adjacent.point) && distance >= gScore[adjacent.point])
                        continue;

                    // Discover new node, and check if this path to it is better than any existing one
                    knownNodes.Enqueue(adjacent);

                    // We've found the latest best path to this node, so record it
                    if (!cameFrom.TryAdd(adjacent.point, current.point))
                        cameFrom[adjacent.point] = current.point;

                    if (!gScore.TryAdd(adjacent.point, distance))
                        gScore[adjacent.point] = distance;

                    adjacent.heuristicDist = distance + GetHeuristic(adjacent.point, end);
                }
            }

            return new LinkedList<Point>();
        }
    }
}
