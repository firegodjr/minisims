using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Sync
{
    public class ServerLog : IServerLog
    {
        public Dictionary<int, TileUpdateDTO[]> TileUpdateLog { get; }
        public Dictionary<int, DroneUpdateDTO[]> DroneUpdateLog { get; }
        public int GameStateID { get; set; }

        public ServerLog()
        {
            TileUpdateLog = new Dictionary<int, TileUpdateDTO[]>();
            DroneUpdateLog = new Dictionary<int, DroneUpdateDTO[]>();
            GameStateID = 1;
        }

        public void LogUpdate(TileUpdateDTO[] tileUpdates)
        {
            TileUpdateLog.Add(GameStateID, tileUpdates);
        }

        public void LogUpdate(DroneUpdateDTO[] droneUpdates)
        {
            DroneUpdateLog.Add(GameStateID, droneUpdates);
        }

        public UpdatePackageDTO GetUpdatesInRange(int startID, int endID)
        {
            UpdatePackageDTO package = new UpdatePackageDTO();
            List<TileUpdateDTO> tileUpdates = new List<TileUpdateDTO>();
            List<DroneUpdateDTO> droneUpdates = new List<DroneUpdateDTO>();
            while (startID <= endID)
            {
                if(TileUpdateLog.ContainsKey(startID))
                {
                    tileUpdates.AddRange(TileUpdateLog[startID]);
                }

                if (DroneUpdateLog.ContainsKey(startID))
                {
                    droneUpdates.AddRange(DroneUpdateLog[startID]);
                }

                startID++;
            }
            package.tileUpdates = tileUpdates.ToArray();
            package.droneUpdates = droneUpdates.ToArray();

            return package;
        }
    }
}
