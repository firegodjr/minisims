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
            Name = name;
            this.goals = goals;
            _gameState = gameState;
            _pathFinder = pathFinder;

            Stats = new Dictionary<StatTypes, IDroneStat>();
            Stats.Add(StatTypes.ENERGY, new DroneStat(StatTypes.ENERGY, 100));
            Stats.Add(StatTypes.WHEAT, new DroneStat(StatTypes.WHEAT, 0));
            Stats.Add(StatTypes.ORE, new DroneStat(StatTypes.ORE, 0));
        }

        public void SetPath(LinkedList<Point> newPath)
        {
            if(newPath.Count > 0)
            {
                this.path = newPath;
                this.pathEnumerator = path.GetEnumerator();
                pathStatus.TileDestination = _gameState.Tiles.GetTileAt(newPath.Last.Value).TileType;
                pathStatus.PathComplete = false;
            }
        }

        public LinkedList<Point> FindPath(int x, int y)
        {
            return _pathFinder.FindBestPath(_gameState.Tiles.TileArray, Location, new Point(x, y));
        }

        public LinkedList<Point> FindPath(TileTypes endTile)
        {
            Point[] destinations = _gameState.Tiles.GetTileLocations(endTile);

            if (destinations.Length > 0)
            {
                Dictionary<float, Point> destByDist = new Dictionary<float, Point>();
                PriorityQueue<float> approxDistances = new PriorityQueue<float>();

                for (int i = 0; i < destinations.Length; ++i)
                {
                    float distance = Location.Dist(destinations[i]);
                    if (!destByDist.ContainsKey(distance))
                    {
                        destByDist.Add(distance, destinations[i]);
                    }

                    approxDistances.Enqueue(distance);
                }

                Point finalDestination = destByDist[approxDistances.Dequeue()];

                return FindPath(finalDestination.x, finalDestination.y);
            }
            else return new LinkedList<Point>();
        }

        public bool StepPath()
        {
            if (path != null)
            {
                if (pathEnumerator.MoveNext())
                {
                    return MoveTo(pathEnumerator.Current.x, pathEnumerator.Current.y);
                }
                else
                {
                    pathStatus.PathComplete = true;
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public DronePathStatus GetPathStatus()
        {
            return pathStatus;
        }

        public bool MoveTo(int x, int y)
        {
            var droneEnumerator = _gameState.Drones.GetEnumerator();
            while(droneEnumerator.MoveNext())
            {
                if(droneEnumerator.Current.Value.Location == new Point(x, y))
                {
                    return false;
                }
            }

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
            
            // Drone loses energy from walking
            update = new DroneUpdateDTO(Name, AddToStat(StatTypes.ENERGY, -1));
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
