using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.Files;
using MinisimsBackend.Game;
using MinisimsBackend.Sync;
using MinisimsServer.DTF;

namespace MinisimsBackend.Controllers
{
    [Route("api/gamesync")]
    [ApiController]
    public class GameSyncController : ControllerBase
    {
        [HttpGet]
        public ActionResult<GameState> Get(int id)
        {
            Log.Write("Caught GET request at api/gamesync");
            if(ServerState.GetID() > id)
            {
                //Client needs an update
            }

            //TODO return something
            return null;
        }

        [HttpPost]
        public ActionResult<int> Post(TileUpdateDTF[] tileUpdates)
        {
            Log.Write("Caught POST request at api/gamesync");
            
            ServerState.UpdateGameState(tileUpdates);
            return ServerState.IncrementID();
        }
    }
}