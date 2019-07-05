using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI;
using MinisimsBackend.Game.AI.Enum;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;

namespace MinisimsBackend.Game
{

    public class GameState : IGameState
    {
        public ITileMap Tiles { get => _tiles; set => _tiles = value; }
        public Dictionary<string, Drone> Drones { get => drones; }

        string name;
        public IServerLog _serverLog;
        ITileMap _tiles;
        Dictionary<string, Drone> drones;
        IPathFinder _pathFinder;
        int selected_drone;

        public GameState(ITileMap tiles, IServerLog serverLog, IPathFinder pathFinder)
        {
            name = "default";
            drones = new Dictionary<string, Drone>();
            _tiles = tiles;
            _pathFinder = pathFinder;
            _serverLog = serverLog;
        }

        public void SetTile(int x, int y, TileTypes type)
        {
            this._tiles.SetTile(x, y, type);
            _serverLog.LogUpdate(new TileUpdateDTO(x, y, (int)type));
        }

        public void SelectDrone(int ID)
        {
            throw new NotImplementedException();
        }

        public void AddDrone(string name, params IGoal[] goals)
        {
            drones.Add(name, new Drone(name, this, _pathFinder, goals));
        }

        public void AddToDroneStat(string name, StatTypes stat, int value)
        {
            if (this.drones[name].Stats.ContainsKey(stat))
                this.drones[name].Stats[stat].StatValue += value;
        }

        public void ClearDroneStat(string name, StatTypes stat)
        {
            if (this.drones[name].Stats.ContainsKey(stat))
                this.drones[name].Stats[stat].StatValue = 0;
        }

        public GameStateDTO AsDTO()
        {
            GameStateDTO gameStateDTO = new GameStateDTO();
            gameStateDTO.name = this.name;
            gameStateDTO.tiles = this.Tiles.AsTileDTOArray();
            List<DroneUpdateDTO> droneList = new List<DroneUpdateDTO>();

            var droneEnumerator = drones.GetEnumerator();
            int i = 0;
            while (droneEnumerator.MoveNext())
            {
                droneList.Add(droneEnumerator.Current.Value.ToDTO());
            }
            gameStateDTO.drones = droneList.ToArray();

            gameStateDTO.selectedDrone = this.selected_drone;

            return gameStateDTO;
        }

        public void Tick()
        {
            DroneUpdateDTO[] droneUpdates = new DroneUpdateDTO[drones.Keys.Count];
            var droneEnumerator = drones.GetEnumerator();
            int i = 0;
            while(droneEnumerator.MoveNext())
            {
                droneUpdates[i] = droneEnumerator.Current.Value.Tick();
                i++;
            }

            Random random = new Random();
            var unripeWheat = _tiles.GetTileLocations(TileTypes.WHEAT);
            for (int w = 0; w < unripeWheat.Length; ++w)
            {
                if(random.Next() % 20 == 0)
                {
                    SetTile(unripeWheat[w].x, unripeWheat[w].y, TileTypes.WHEAT_RIPE);
                }
            }

            _serverLog.LogUpdate(droneUpdates);
            _serverLog.GameStateID++;
        }
    }
}
