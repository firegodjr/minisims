using MinisimsBackend.DI.Abstractions;
using MinisimsServer.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Util
{
    public class Log : ILog
    {
        static readonly string LOG_URL = $"Logs/log_{DateTime.Now.ToLongTimeString().Replace(':', '_')}.txt";
        public void Write(string text)
        {
            string line = $"[{DateTime.Now.ToLocalTime()}] {text}";
            Console.WriteLine(line);
            FileMgr.AppendFileText(LOG_URL, line + "\n");
        }
    }
}
