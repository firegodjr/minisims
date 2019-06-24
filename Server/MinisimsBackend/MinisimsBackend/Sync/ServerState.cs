using MinisimsBackend.Game;
using MinisimsBackend.Sync;
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
        static void ApplyTileUpdate(TileUpdate update)
        {
            game.UpdateTile(update.x, update.y, update.type);
        }

        /// <summary>
        /// Applies tile updates to the GameState
        /// </summary>
        /// <param name="tileUpdates"></param>
        public static void UpdateGameState(params TileUpdate[] tileUpdates)
        {
            for(int i = 0; i < tileUpdates.Length; ++i)
            {
                ApplyTileUpdate(tileUpdates[i]);
            }

            IncrementID();
        }
    }
}
