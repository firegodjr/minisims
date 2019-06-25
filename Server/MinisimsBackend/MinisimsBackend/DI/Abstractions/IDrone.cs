using MinisimsBackend.Game.AI.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IDrone
    {
        string Name { get; set; }

        /// <summary>
        /// Attempts to move the drone to the given coordinates, returns true if move is successful
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns>Move success</returns>
        bool MoveTo(int x, int y);
        /// <summary>
        /// Find a path to the given coordinates, returns true if path exists
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <returns>Path exists</returns>
        bool FindPath(int x, int y);
        /// <summary>
        /// Begins traversing the found path
        /// </summary>
        void BeginTraversePath();
        /// <summary>
        /// Stops traversing the path
        /// </summary>
        void StopTraversePath();
        /// <summary>
        /// Returns the current path traversal status
        /// </summary>
        /// <returns></returns>
        DronePathStatus GetPathStatus();
    }
}
