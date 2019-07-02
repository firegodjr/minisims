using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Enum;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI
{
    public interface IGoal
    {
        StatTypes Item { get; set; }
        bool TryComplete(IDrone drone, IGameState gameState, out DroneUpdateDTO droneUpdate);
    }
}
