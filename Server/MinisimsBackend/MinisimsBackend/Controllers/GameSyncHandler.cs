using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTF;

namespace MinisimsBackend.Controllers
{
    internal class GameSyncHandler : IGameSyncHandler
    {
        private IServerState _serverState;

        public GameSyncHandler(IServerState serverState)
        {
            this._serverState = serverState;
        }

        public ActionResult<IGameState> Get(int clientStateID)
        {
            if (_serverState.GameStateID > clientStateID)
            {
                return new ActionResult<IGameState>(_serverState.GameState);
            }
            else return null;
        }

        public ActionResult<int> Post(TileUpdateDTF[] clientUpdates)
        {
            for(int i = 0; i < clientUpdates.Length; ++i)
            {
                _serverState.ApplyTileUpdate(clientUpdates[i]);
            }

            if(clientUpdates.Length > 0)
            {
                _serverState.IncrementID();
            }

            return _serverState.GameStateID;
        }
    }
}