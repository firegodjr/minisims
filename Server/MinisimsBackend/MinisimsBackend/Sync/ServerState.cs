using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using MinisimsBackend.Sync;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend
{
    public class ServerState : IServerState
    {
        public IGameState GameState { get => _game; }
        public IServerLog ServerLog { get => _serverLog; }

        IGameState _game;
        IServerLog _serverLog;

        public ServerState(IGameState _game, IServerLog _serverLog)
        {
            this._game = _game;
            this._serverLog = _serverLog;
        }

        public int GetID()
        {
            return ServerLog.GameStateID;
        }

        public int IncrementID()
        {
            ServerLog.GameStateID += 1;
            return ServerLog.GameStateID;
        }

        /// <summary>
        /// Updates a single tile's type in the GameState
        /// </summary>
        /// <param name="update"></param>
        public void ApplyTileUpdate(TileUpdateDTO tileUpdate)
        {
            _game.Tiles.SetTile(tileUpdate.x, tileUpdate.y, (TileTypes)tileUpdate.type);
        }
    }
}
