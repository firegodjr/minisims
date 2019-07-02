using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTO;

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
            return new ActionResult<int>(_serverState.ServerLog.GameStateID);
        }

        public ActionResult<GameStateDTO> GetState()
        {
            return new ActionResult<GameStateDTO>(_serverState.GameState.AsDTO());
        }

        public ActionResult<UpdatePackageDTO> GetUpdates(int id)
        {
            return new ActionResult<UpdatePackageDTO>(_serverState.ServerLog.GetUpdatesInRange(id, _serverState.ServerLog.GameStateID));
        }

        public ActionResult<int> Post(TileUpdateDTO[] clientUpdates)
        {
            for(int i = 0; i < clientUpdates.Length; ++i)
            {
                _serverState.ApplyTileUpdate(clientUpdates[i]);
            }

            if(clientUpdates.Length > 0)
            {
                _serverState.IncrementID();
                _serverState.ServerLog.LogUpdate(clientUpdates);
            }

            return _serverState.ServerLog.GameStateID;
        }
    }
}