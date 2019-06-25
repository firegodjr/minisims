using MinisimsBackend.Game;
using MinisimsBackend.Sync;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsServer.DTF
{
    public enum DTFTypes
    {
        GAMESTATE
    }

    public enum PostActions
    {
        SAVE_FILE,
        SEND_TO_CLIENTS
    }

    public class TileUpdateDTF
    {
        public int x;
        public int y;
        public int type;

        public Tiles GetTileType()
        {
            return (Tiles)type;
        }

        public TileUpdate ToTileUpdate()
        {
            return new TileUpdate(x, y, GetTileType());
        }

        public override string ToString()
        {
            return $"x: {x}, y: {y}, type: {type}";
        }
    }

    public class GameStateDTF
    {

    }

    public class GenericDTF
    {
        public string id;
        public int type;
        public int action;
        public string[] options;
        public string data;
    }
}
