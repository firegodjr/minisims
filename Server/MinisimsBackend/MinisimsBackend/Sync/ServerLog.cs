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
        public Dictionary<int, TileUpdateDTO[]> TileUpdateLog { get; set; }

        public ServerLog()
        {
            TileUpdateLog = new Dictionary<int, TileUpdateDTO[]>();
        }

        public void LogUpdate(int id, TileUpdateDTO[] tileUpdates)
        {
            TileUpdateLog.Add(id, tileUpdates);
        }

        public TileUpdateDTO[] GetUpdatesInRange(int startID, int endID)
        {
            List<TileUpdateDTO> updates = new List<TileUpdateDTO>();
            while (startID <= endID)
            {
                if(TileUpdateLog.ContainsKey(startID))
                {
                    updates.AddRange(TileUpdateLog[startID]);
                }
                startID++;
            }

            return updates.ToArray();
        }
    }
}
