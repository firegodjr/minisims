using MinisimsBackend.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Sync
{
    public struct TileUpdate
    {
        public int x;
        public int y;
        public Tiles type;

        public TileUpdate(int x, int y, Tiles type)
        {
            this.x = x;
            this.y = y;
            this.type = type;
        }
    }
}
