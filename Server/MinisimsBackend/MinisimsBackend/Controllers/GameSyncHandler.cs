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

        public ActionResult<int> GetID()
        {
            return new ActionResult<int>(_serverState.GameStateID);
        }

        public ActionResult<GameStateDTF> GetState()
        {
            return new ActionResult<GameStateDTF>(_serverState.GameState.AsDTF());
        }

        public ActionResult<TileUpdateDTF[]> GetUpdates(int id)
        {
            return new ActionResult<TileUpdateDTF[]>(_serverState.ServerLog.GetUpdatesInRange(id, _serverState.GameStateID));
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
                _serverState.ServerLog.LogUpdate(_serverState.GameStateID, clientUpdates);
            }

            return _serverState.GameStateID;
        }
    }
}