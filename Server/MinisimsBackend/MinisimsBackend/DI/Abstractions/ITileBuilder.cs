using MinisimsBackend.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface ITileGenerator
    {
        void GenerateTiles(IGameState game, int width, int height);
    }
}
