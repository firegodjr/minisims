using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Enum;
using MinisimsServer.DTO;

namespace MinisimsBackend.Game.AI.Goals
{
    public class GoalEatItem : IGoal
    {
        private const int DRONE_ENERGY_THRESHOLD = 50;
        private const int DRONE_ENERGY_GAIN = 50;
        public StatTypes Item { get; set; }

        public GoalEatItem(StatTypes item)
        {
            Item = item;
        }

        public bool TryComplete(IDrone drone, IGameState gameState, out DroneUpdateDTO update)
        {
            if(drone.Stats[StatTypes.ENERGY].StatValue < DRONE_ENERGY_THRESHOLD)
            {
                if (drone.Stats.ContainsKey(Item))
                {
                    if (drone.Stats[Item].TrySubtract(1))
                    {
                        DroneStatChangeDTO statChange = drone.AddToStat(StatTypes.ENERGY, DRONE_ENERGY_GAIN);
                        update = new DroneUpdateDTO(drone.Name, statChange);
                        return true;
                    }
                }
            }

            update = null;
            return false;
        }
    }
}
