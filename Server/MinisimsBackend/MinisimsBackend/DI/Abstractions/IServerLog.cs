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
        void LogUpdate(TileUpdateDTO[] tileUpdates);
        void LogUpdate(DroneUpdateDTO[] droneUpdates);
        UpdatePackageDTO GetUpdatesInRange(int startID, int endID);
    }
}
