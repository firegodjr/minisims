using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Autofac.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using MinisimsBackend.Util;
using MinisimsBackend.Game;
using Autofac;
using MinisimsBackend.DI;
using MinisimsBackend.DI.Abstractions;
using MinisimsBackend.Game.Map;

namespace MinisimsBackend
{
    public class Program
    {
        public static IGameState Game;

        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args)
            .ConfigureServices(services => services.AddAutofac())
            .Build()
            .Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}
