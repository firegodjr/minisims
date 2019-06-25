using MinisimsBackend.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IGameState
    {
        ITileMap Tiles { get; set; }
        void SelectDrone(int ID);
    }
}
