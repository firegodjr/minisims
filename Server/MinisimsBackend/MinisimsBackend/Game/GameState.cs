using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;
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

        public GameStateDTO AsDTO()
        {
            GameStateDTO gameStateDTO = new GameStateDTO();
            gameStateDTO.name = this.name;
            gameStateDTO.tiles = this.Tiles.AsTileDTOArray();
            gameStateDTO.selectedDrone = this.selected_drone;

            return gameStateDTO;
        }
    }
}
