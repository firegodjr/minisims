using MinisimsBackend.Game;
using MinisimsBackend.Sync;
using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend
{
    public static class ServerState
    {
        static GameState game;
        static int gameStateID;

        public static int GetID()
        {
            return gameStateID;
        }

        public static int IncrementID()
        {
            gameStateID += 1;
            return gameStateID;
        }

        /// <summary>
        /// Updates a single tile's type in the GameState
        /// </summary>
        /// <param name="update"></param>
        static void ApplyTileUpdate(TileUpdateDTF tileUpdate)
        {
            game.UpdateTile(tileUpdate.x, tileUpdate.y, (Tiles)tileUpdate.type);
        }

        /// <summary>
        /// Applies tile updates to the GameState
        /// </summary>
        /// <param name="tileUpdates"></param>
        public static void UpdateGameState(params TileUpdateDTF[] tileUpdates)
        {
            for(int i = 0; i < tileUpdates.Length; ++i)
            {
                ApplyTileUpdate(tileUpdates[i]);
            }

            IncrementID();
        }
    }
}
