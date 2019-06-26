using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IServerLog
    {
        void LogUpdate(int id, TileUpdateDTF[] tileUpdates);
        TileUpdateDTF[] GetUpdatesInRange(int startID, int endID);
    }
}
