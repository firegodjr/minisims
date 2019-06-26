using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.Map
{
    public struct Tile
    {
        public TileTypes TileType { get; set; }
        public float Height { get; set; }

        public Tile(TileTypes tileType, float height)
        {
            TileType = tileType;
            Height = height;
        }

        public TileDTF AsDTF()
        {
            return new TileDTF((int)TileType, Height);
        }
    }
}
