using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsServer.Objects
{
    public class FileMgr
    {
        static readonly string OBJ_PATH = "./Files/";

        public static string GetFileText(string url)
        {
            StreamReader objFile = File.OpenText(OBJ_PATH + url);
            string text = objFile.ReadToEnd();
            return text;
        }

        public static void SaveFileText(string url, string text)
        {
            using (TextWriter objFile = new StreamWriter(File.OpenWrite(OBJ_PATH + url)))
            {
                objFile.Write(text);
            }
        }
    }
}
