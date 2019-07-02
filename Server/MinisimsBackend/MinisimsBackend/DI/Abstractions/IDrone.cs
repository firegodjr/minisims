using MinisimsBackend.Game.AI;
using MinisimsBackend.Game.AI.Enum;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IDrone
    {
        string Name { get; set; }
        Point Location { get; set; }
        Dictionary<StatTypes, IDroneStat> Stats { get; }
        /// <summary>
        /// Attempts to move the drone to the given coordinates, returns true if move is successful
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns>Move success</returns>
        bool MoveTo(int x, int y);
        void SetPath(LinkedList<Point> path);
        /// <summary>
        /// Find a path to the given coordinates, returns true if path exists
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns>Path exists</returns>
        LinkedList<Point> FindPath(int x, int y);
        LinkedList<Point> FindPath(TileTypes endTile);
        bool StepPath();
        DroneStatChangeDTO AddToStat(StatTypes stat, int value);
        DroneUpdateDTO Tick();
        /// <summary>
        /// Returns the current path traversal status
        /// </summary>
        /// <returns></returns>
        DronePathStatus GetPathStatus();
        DroneUpdateDTO ToDTO();
    }
}
