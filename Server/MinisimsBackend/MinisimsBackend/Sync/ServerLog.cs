using MinisimsBackend.DI.Abstractions;
using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Sync
{
    public class ServerLog : IServerLog
    {
        public Dictionary<int, TileUpdateDTF[]> TileUpdateLog { get; set; }

        public ServerLog()
        {
            TileUpdateLog = new Dictionary<int, TileUpdateDTF[]>();
        }

        public void LogUpdate(int id, TileUpdateDTF[] tileUpdates)
        {
            TileUpdateLog.Add(id, tileUpdates);
        }

        public TileUpdateDTF[] GetUpdatesInRange(int startID, int endID)
        {
            List<TileUpdateDTF> updates = new List<TileUpdateDTF>();
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
