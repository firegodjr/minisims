using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map
{
    public struct Point
    {
        public int x;
        public int y;

        public Point(int x = 0, int y = 0)
        {
            this.x = x;
            this.y = y;
        }

        public float Dist(Point p)
        {
            return (float)Math.Sqrt(Math.Pow(x - p.x, 2) + Math.Pow(y - p.y, 2));
        }

        public static bool operator==(Point p1, Point p2)
        {
            return p1.x == p2.x && p1.y == p2.y;
        }

        public static bool operator !=(Point p1, Point p2)
        {
            return !(p1 == p2);
        }
    }
}
