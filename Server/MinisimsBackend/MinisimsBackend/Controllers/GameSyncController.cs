using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTO;

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
        public ActionResult<GameStateDTO> GetState()
        {
            return _gameSyncHandler.GetState();
        }

        [HttpGet("updates/{id}")]
        public ActionResult<UpdatePackageDTO> GetUpdates(int id)
        {
            return _gameSyncHandler.GetUpdates(id);
        }

        [HttpPost]
        public ActionResult<int> Post(TileUpdateDTO[] tileUpdates)
        {
            return _gameSyncHandler.Post(tileUpdates);
        }
    }
}