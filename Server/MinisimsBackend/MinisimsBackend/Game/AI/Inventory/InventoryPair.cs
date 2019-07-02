using MinisimsBackend.Game.AI.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI.Inventory
{
    public class InventoryPair
    {
        public StatTypes Item { get; private set; }
        public int Count { get; private set; }
        public InventoryPair(StatTypes item, int count)
        {
            Item = item;
            Count = count;
        }

        public void Add(int amount)
        {
            Count += amount;
        }

        public bool Remove(int amount)
        {
            if (Count >= amount)
            {
                Count -= amount;
                return true;
            }
            else return false;
        }
    }
}
