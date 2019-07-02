
using MinisimsBackend.Game.Map;

namespace MinisimsBackend.Game.AI.Enum
{
    public struct DronePathStatus
    {
        public TileTypes TileDestination { get; set; }
        public bool PathComplete { get; set; }

        public DronePathStatus(TileTypes destination, bool complete)
        {
            TileDestination = destination;
            PathComplete = complete;
        }
    }
}