using MinisimsBackend.Game.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI.Pathing
{
    public class PathNode : IComparable<PathNode>
    {
        public Point point;
        public int x { get => point.x; }
        public int y { get => point.y; }
        public float dist;
        public float heuristicDist;
        public PathNode(int x, int y, float dist)
        {
            this.point.x = x;
            this.point.y = y;
            this.dist = dist;
            this.heuristicDist = -1;
        }

        public int CompareTo(PathNode other)
        {
            return (int)(100 * (other.heuristicDist - this.heuristicDist));
        }
    }
}
