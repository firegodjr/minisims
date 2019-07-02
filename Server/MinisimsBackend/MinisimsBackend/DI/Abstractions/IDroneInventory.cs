using MinisimsBackend.Game.AI.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    public interface IDroneInventory
    {
        int Get(StatTypes item);
        int GetInvPair(StatTypes item);
        int AddItem(StatTypes item, int count);
    }
}
