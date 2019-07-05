using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinisimsBackend.Game.AI.Enum;

namespace MinisimsBackend.Game.AI
{
    public class DroneStat : IDroneStat
    {
        public StatTypes statType { get; set; }

        public int StatValue { get; set; }
        public object StatMeta { get; set; }

        public DroneStat(StatTypes type, int value, object meta = null)
        {
            statType = type;
            StatValue = value;
            StatMeta = meta;
        }

        public T GetMetaAs<T>()
        {
            throw new NotImplementedException();
        }

        public bool TrySubtract(int amount)
        {
            if(StatValue >= amount)
            {
                StatValue -= amount;
                return true;
            }

            return false;
        }
    }
}
