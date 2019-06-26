using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MinisimsBackend.Controllers;
using MinisimsBackend.DI;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using MinisimsBackend.Sync;
using MinisimsBackend.Util;

namespace MinisimsBackend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            var containerBuilder = new ContainerBuilder();
            containerBuilder.Populate(services);
            containerBuilder.RegisterType<RandomMapGenerator>().As<ITileGenerator>();
            containerBuilder.RegisterType<GameSyncHandler>().As<IGameSyncHandler>().SingleInstance();
            containerBuilder.RegisterType<Log>().As<ILog>().SingleInstance();
            containerBuilder.RegisterType<TileMap>().As<ITileMap>();
            containerBuilder.RegisterType<GameState>().As<IGameState>().SingleInstance();
            containerBuilder.RegisterType<ServerState>().As<IServerState>().SingleInstance();
            containerBuilder.RegisterType<ServerLog>().As<IServerLog>().SingleInstance();

            var container = containerBuilder.Build();
            return new AutofacServiceProvider(container);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
