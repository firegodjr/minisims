﻿using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface ITileMap
    {
        void Init(int width, int height, TileTypes fillTile);
        void SetTile(int x, int y, TileTypes type, float height);
        void SetTile(int x, int y, Tile tile);
        /// <summary>
        /// Set tile type, keeping height the same
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="type"></param>
        void SetTile(int x, int y, TileTypes type);
        Tile[][] TileArray { get; }
        TileDTO[][] AsTileDTOArray();
    }
}
