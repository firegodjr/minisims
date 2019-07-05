using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IServerLog
    {
        int GameStateID { get; set; }
        void LogUpdate(params TileUpdateDTO[] tileUpdates);
        void LogUpdate(params DroneUpdateDTO[] droneUpdates);
        UpdatePackageDTO GetUpdatesInRange(int startID, int endID);
    }
}
