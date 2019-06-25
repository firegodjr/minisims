using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
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
        public TileTypes type;

        public TileUpdate(int x, int y, TileTypes type)
        {
            this.x = x;
            this.y = y;
            this.type = type;
        }
    }
}
