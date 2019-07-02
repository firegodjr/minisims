using MinisimsBackend.Game.AI.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI
{
    public interface IDroneStat
    {
        StatTypes statType { get; }
        int StatValue { get; set; }
        bool TrySubtract(int amount);
        object StatMeta { get; set; }
        T GetMetaAs<T>();
    }
}
