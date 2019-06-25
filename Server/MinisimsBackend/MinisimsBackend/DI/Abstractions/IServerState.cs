using MinisimsBackend.Sync;
using MinisimsServer.DTF;
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
        void ApplyTileUpdate(TileUpdateDTF tileUpdate);
        int IncrementID();
    }
}
