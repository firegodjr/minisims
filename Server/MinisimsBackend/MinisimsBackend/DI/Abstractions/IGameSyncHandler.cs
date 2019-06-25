using Microsoft.AspNetCore.Mvc;
using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IGameSyncHandler
    {
        ActionResult<IGameState> Get(int id);
        ActionResult<int> Post(TileUpdateDTF[] tileUpdates);
    }
}
