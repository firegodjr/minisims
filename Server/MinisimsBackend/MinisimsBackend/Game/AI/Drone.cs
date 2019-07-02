using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Enum;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI
{
    public class Drone : IDrone
    {
        public delegate Drone Factory();

        public string Name { get; set; }
        public Point Location { get; set; }
        public Dictionary<StatTypes, IDroneStat> Stats { get; }

        private LinkedList<Point> path;
        private LinkedList<Point>.Enumerator pathEnumerator;
        private IGoal[] goals;
        private DronePathStatus pathStatus;
        private IGameState _gameState;
        private IPathFinder _pathFinder;

        public Drone(string name, IGameState gameState, IPathFinder pathFinder, params IGoal[] goals)
        {
            _gameState = gameState;
            _pathFinder = pathFinder;

            Stats = new Dictionary<StatTypes, IDroneStat>();
        }

        public void SetPath(LinkedList<Point> newPath)
        {
            this.path = newPath;
            this.pathEnumerator = path.GetEnumerator();
            pathStatus.TileDestination = _gameState.Tiles.GetTileAt(newPath.Last.Value).TileType;
            pathStatus.PathComplete = false;
        }

        public LinkedList<Point> FindPath(int x, int y)
        {
            return _pathFinder.FindBestPath(_gameState.Tiles.TileArray, Location, new Point(x, y));
        }

        public LinkedList<Point> FindPath(TileTypes endTile)
        {
            Point[] destinations = _gameState.Tiles.GetTileLocations(endTile);
            Dictionary<float, Point> destByDist = new Dictionary<float, Point>();
            PriorityQueue<float> approxDistances = new PriorityQueue<float>();

            for (int i = 0; i < destinations.Length; ++i)
            {
                float distance = Location.Dist(destinations[i]);
                destByDist.Add(distance, destinations[i]);
                approxDistances.Enqueue(distance);
            }

            Point finalDestination = destByDist[approxDistances.Dequeue()];

            return FindPath(finalDestination.x, finalDestination.y);
        }

        public bool StepPath()
        {
            if(pathEnumerator.MoveNext())
            {
                return MoveTo(pathEnumerator.Current.x, pathEnumerator.Current.y);
            }
            else
            {
                pathStatus.PathComplete = true;
                return false;
            }
        }

        public DronePathStatus GetPathStatus()
        {
            return pathStatus;
        }

        public bool MoveTo(int x, int y)
        {
            Location = new Point(x, y);
            return true;
        }

        public DroneStatChangeDTO AddToStat(StatTypes stat, int value)
        {
            Stats[stat].StatValue += value;
            return new DroneStatChangeDTO(stat, Stats[stat].StatValue);
        }

        public DroneUpdateDTO Tick()
        {
            DroneUpdateDTO update;
            for(int i = 0; i < goals.Length; ++i)
            {
                if(goals[i].TryComplete(this, _gameState, out update))
                {
                    return update;
                }
            }

            return null;
        }

        public DroneUpdateDTO ToDTO()
        {
            List<DroneStatChangeDTO> stats = new List<DroneStatChangeDTO>();
            var statEnumerator = Stats.GetEnumerator();
            while(statEnumerator.MoveNext())
            {
                IDroneStat stat = statEnumerator.Current.Value;
                stats.Add(new DroneStatChangeDTO(stat.statType, stat.StatValue));
            }
            return new DroneUpdateDTO(Name, Location.x, Location.y, stats.ToArray());
        }
    }
}
