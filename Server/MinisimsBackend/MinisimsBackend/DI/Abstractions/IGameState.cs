using MinisimsBackend.Game;
using MinisimsBackend.Game.AI;
using MinisimsBackend.Game.Map;
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
        Dictionary<string, Drone> Drones { get; }
        void AddDrone(string name, params IGoal[] goals);
        void SelectDrone(int ID);
        void SetTile(int x, int y, TileTypes type);
        GameStateDTO AsDTO();
        void Tick();
    }
}
