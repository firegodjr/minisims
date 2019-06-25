using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.AI.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game.AI
{
    public class Drone : IDrone
    {
        public string Name { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }

        public void BeginTraversePath()
        {
            throw new NotImplementedException();
        }

        public bool FindPath(int x, int y)
        {
            throw new NotImplementedException();
        }

        public DronePathStatus GetPathStatus()
        {
            throw new NotImplementedException();
        }

        public bool MoveTo(int x, int y)
        {
            throw new NotImplementedException();
        }

        public void StopTraversePath()
        {
            throw new NotImplementedException();
        }
    }
}
