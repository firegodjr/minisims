using Microsoft.AspNetCore.Mvc;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IGameSyncHandler
    {
        ActionResult<int> GetID();
        ActionResult<GameStateDTO> GetState();
        ActionResult<TileUpdateDTO[]> GetUpdates(int id);
        ActionResult<int> Post(TileUpdateDTO[] tileUpdates);
    }
}
