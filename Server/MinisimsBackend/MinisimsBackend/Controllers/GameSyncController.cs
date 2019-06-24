using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MinisimsBackend.Sync;
using MinisimsServer.DTF;

namespace MinisimsBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameSyncController : ControllerBase
    {
        public ActionResult<IEnumerable<string>> Get(int id)
        {
            if(ServerState.GetID() > id)
            {
                //Client needs an update
            }

            return new string[] {  };
        }

        public int Post(TileUpdateDTF[] tileUpdateDTFArr)
        {
            TileUpdate[] updates = new TileUpdate[tileUpdateDTFArr.Length];
            // Convert to non-DTF type
            for(int i = 0; i < tileUpdateDTFArr.Length; ++i)
            {
                updates[i] = tileUpdateDTFArr[i].ToTileUpdate();
            }
            
            ServerState.UpdateGameState(updates);
            return ServerState.IncrementID();
        }
    }
}