using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.DI.Abstractions
{
    interface ILog
    {
        /// <summary>
        /// Write a line of text to the log
        /// </summary>
        /// <param name="text"></param>
        void Write(string text);
    }
}
