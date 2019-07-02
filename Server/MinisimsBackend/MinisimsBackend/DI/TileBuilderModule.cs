using Autofac;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.Map.Generation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI
{
    public class TileGeneratorModule : Module
    {
        public bool UseNoiseGenerator { get; set; }

        protected override void Load(ContainerBuilder builder)
        {
            if(UseNoiseGenerator)
                builder.Register(c => new PerlinMapGenerator()).As<ITileGenerator>();
            else
                builder.Register(c => new RandomMapGenerator()).As<ITileGenerator>();
        }
    }
}
