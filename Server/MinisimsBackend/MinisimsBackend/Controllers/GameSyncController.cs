using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTF;

namespace MinisimsBackend.Controllers
{
    [Route("api/gamesync")]
    [ApiController]
    public class GameSyncController : ControllerBase
    {
        private IGameSyncHandler _gameSyncHandler;
        public GameSyncController(IGameSyncHandler _gameSyncHandler)
        {
            this._gameSyncHandler = _gameSyncHandler;
        }

        [HttpGet("id")]
        public ActionResult<int> GetID()
        {
            return _gameSyncHandler.GetID();
        }

        [HttpGet("state")]
        public ActionResult<GameStateDTF> GetState()
        {
            return _gameSyncHandler.GetState();
        }

        [HttpGet("updates/{id}")]
        public ActionResult<TileUpdateDTF[]> GetUpdates(int id)
        {
            return _gameSyncHandler.GetUpdates(id);
        }

        [HttpPost]
        public ActionResult<int> Post(TileUpdateDTF[] tileUpdates)
        {
            return _gameSyncHandler.Post(tileUpdates);
        }
    }
}