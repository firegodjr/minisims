﻿using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTO;
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

        public TileDTO AsDTO()
        {
            return new TileDTO((int)TileType, Height);
        }
    }
}