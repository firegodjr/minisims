using MinisimsBackend.Game;
using MinisimsBackend.Game.AI;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IGameState
    {
        ITileMap Tiles { get; set; }
        void AddDrone(string name, params IGoal[] goals);
        void SelectDrone(int ID);
        GameStateDTO AsDTO();
        void Tick();
    }
}
