using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI
{
    public interface IDeficit
    {
        IDroneStat DroneStat { get; }
        int StatThreshold { get; }
        bool IsPositiveThreshold { get; }

        //TODO dronehasdeficit
    }
}
