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
using Microsoft.Extensions.Logging;
using MinisimsBackend.Files;
using MinisimsBackend.Game;

namespace MinisimsBackend
{
    public class Program
    {
        static readonly GameState game;

        public static void Main(string[] args)
        {
            game.GenerateTiles(16, 16);

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
