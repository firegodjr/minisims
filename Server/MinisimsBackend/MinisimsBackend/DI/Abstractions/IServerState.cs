using MinisimsBackend.Sync;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    interface IServerState
    {
        int GameStateID { get; }
        IGameState GameState { get; }
        IServerLog ServerLog { get; }
        void ApplyTileUpdate(TileUpdateDTO tileUpdate);
        int IncrementID();
    }
}
