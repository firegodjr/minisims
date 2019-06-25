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

        [HttpGet]
        public ActionResult<IGameState> Get(int id)
        {
            return _gameSyncHandler.Get(id);
        }

        [HttpPost]
        public ActionResult<int> Post(TileUpdateDTF[] tileUpdates)
        {
            return _gameSyncHandler.Post(tileUpdates);
        }
    }
}