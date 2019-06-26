using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using MinisimsBackend.Sync;
using MinisimsServer.DTF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend
{
    public class ServerState : IServerState
    {
        public int GameStateID { get => gameStateID; }
        public IGameState GameState { get => _game; }
        public IServerLog ServerLog { get => _serverLog; }

        IGameState _game;
        IServerLog _serverLog;
        int gameStateID = 1;

        public ServerState(IGameState _game, IServerLog _serverLog)
        {
            this._game = _game;
            this._serverLog = _serverLog;
        }

        public int GetID()
        {
            return gameStateID;
        }

        public int IncrementID()
        {
            gameStateID += 1;
            return gameStateID;
        }

        /// <summary>
        /// Updates a single tile's type in the GameState
        /// </summary>
        /// <param name="update"></param>
        public void ApplyTileUpdate(TileUpdateDTF tileUpdate)
        {
            _game.Tiles.SetTile(tileUpdate.x, tileUpdate.y, (TileTypes)tileUpdate.type);
        }
    }
}
