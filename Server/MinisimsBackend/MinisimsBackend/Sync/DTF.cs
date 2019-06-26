using MinisimsBackend.Game;
using MinisimsBackend.Game.Map;
using MinisimsBackend.Sync;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsServer.DTO
{
    public enum DTOTypes
    {
        GAMESTATE
    }

    public enum PostActions
    {
        SAVE_FILE,
        SEND_TO_CLIENTS
    }

    public class TileDTO
    {
        public int type;
        public float height;

        public TileDTO(int type, float height)
        {
            this.type = type;
            this.height = height;
        }
    }

    public class TileUpdateDTO
    {
        public int x;
        public int y;
        public int type;

        public TileTypes GetTileType()
        {
            return (TileTypes)type;
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

    public class GameStateDTO
    {
        public string name;
        public TileDTO[][] tiles;
        public int selectedDrone;
    }

    public class ClientIDDTO
    {
        public int id;
    }

    public class GenericDTO
    {
        public string id;
        public int type;
        public int action;
        public string[] options;
        public string data;
    }
}
