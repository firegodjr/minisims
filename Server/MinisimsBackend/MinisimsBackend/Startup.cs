using System;
using System.Net.WebSockets;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MinisimsBackend.Controllers;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game;
using MinisimsBackend.Game.AI;
using MinisimsBackend.Game.AI.Pathing;
using MinisimsBackend.Game.Map;
using MinisimsBackend.Game.Map.Generation;
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

            var cb = new ContainerBuilder();
            cb.Populate(services);
            cb.RegisterType<PerlinMapGenerator>().As<ITileGenerator>();
            cb.RegisterType<AStarPathFinder>().As<IPathFinder>();
            cb.RegisterType<GameSyncHandler>().As<IGameSyncHandler>().SingleInstance();
            cb.RegisterType<Log>().As<ILog>().SingleInstance();
            cb.RegisterType<TileMap>().As<ITileMap>();
            cb.RegisterType<GameState>().As<IGameState>().SingleInstance();
            cb.RegisterType<ServerState>().As<IServerState>().SingleInstance();
            cb.RegisterType<ServerLog>().As<IServerLog>().SingleInstance();

            var container = cb.Build();
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
            app.UseWebSockets();
        }
    }
}
