using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IServerLog
    {
        void LogUpdate(int id, TileUpdateDTO[] tileUpdates);
        TileUpdateDTO[] GetUpdatesInRange(int startID, int endID);
    }
}
