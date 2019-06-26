using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface ITileGenerator
    {
        Tile[][] GenerateTiles(int width, int height);
    }
}
