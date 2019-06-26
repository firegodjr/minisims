using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTF;
using System;

namespace MinisimsBackend.Game
{

    public class GameState : IGameState
    {
        public ITileMap Tiles { get => _tiles; set => _tiles = value; }

        string name;
        ITileMap _tiles;
        IDrone[] drones;
        int selected_drone;

        public GameState(ITileMap _tiles)
        {
            this.name = "default";
            this._tiles = _tiles;
        }

        public void SetTile(int x, int y, TileTypes type)
        {
            this._tiles.SetTile(x, y, type);
        }

        public void SelectDrone(int ID)
        {
            throw new NotImplementedException();
        }

        public GameStateDTF AsDTF()
        {
            GameStateDTF gameStateDTF = new GameStateDTF();
            gameStateDTF.m_name = this.name;
            gameStateDTF.m_tiles = this.Tiles.AsTileDTFArray();
            gameStateDTF.m_selected_drone = this.selected_drone;

            return gameStateDTF;
        }
    }
}
