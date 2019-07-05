using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Enum;
using MinisimsBackend.Game.Map;
using MinisimsServer.DTO;

namespace MinisimsBackend.Game.AI.Goals
{
    public class GoalHarvestTile : IGoal
    {
        private readonly Dictionary<StatTypes, TileTypes> TILE_LOOT = new Dictionary<StatTypes, TileTypes>();
        private readonly Dictionary<TileTypes, TileTypes> TILE_DECAY = new Dictionary<TileTypes, TileTypes>();
        private const int ITEM_THRESHOLD = 1000;
        public StatTypes Item { get; set; }

        public GoalHarvestTile(StatTypes item)
        {
            Item = item;

            TILE_LOOT.Add(StatTypes.WHEAT, TileTypes.WHEAT_RIPE);
            TILE_LOOT.Add(StatTypes.ORE, TileTypes.ORE_RIPE);
            TILE_DECAY.Add(TileTypes.WHEAT_RIPE, TileTypes.WHEAT);
            TILE_DECAY.Add(TileTypes.ORE_RIPE, TileTypes.ORE);
        }

        public bool TryComplete(IDrone drone, IGameState gameState, out DroneUpdateDTO update)
        {
            TileTypes tile = TILE_LOOT[Item];
            var pathStatus = drone.GetPathStatus();

            // If the drone doesn't have enough of the wanted item
            if (drone.Stats[Item].StatValue < ITEM_THRESHOLD)
            {
                DroneStatChangeDTO statChange = new DroneStatChangeDTO(Item, 0);
                update = new DroneUpdateDTO(drone.Name, statChange);

                // Either we're standing on the tile, we're en route to the tile, or we path to the tile.
                if (gameState.Tiles.GetTileAt(drone.Location).TileType == tile)
                {
                    gameState.SetTile(drone.Location.x, drone.Location.y, TILE_DECAY[tile]);
                    statChange = drone.AddToStat(Item, 5);
                    drone.StepPath();
                }
                else // Decide on a new path, and start walking
                {
                    drone.SetPath(drone.FindPath(tile));
                    drone.StepPath(); // Initial step is the same as current location

                    if(drone.Stats[StatTypes.ENERGY].TrySubtract(5))
                    {
                        takeStep(drone, update);
                        statChange = drone.AddToStat(StatTypes.ENERGY, 0);
                    }
                }

                update.stats = new DroneStatChangeDTO[] { statChange };
                return true;
            }
            // Only returns if we don't need the item right now
            else
            {
                update = null;
                return false;
            }
        }

        private void takeStep(IDrone drone, DroneUpdateDTO update)
        {
                drone.StepPath(); // Do first step of path
                update.x = drone.Location.x;
                update.y = drone.Location.y;
        }
    }
}
