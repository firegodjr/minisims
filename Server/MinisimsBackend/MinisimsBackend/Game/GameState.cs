using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinisimsBackend.Game
{
    public enum Tiles
    {
        GRASS,
        WHEAT,
        WHEAT_RIPE,
        STONE,
        ORE,
        ORE_RIPE,
        WATER
    }

    struct Tile
    {
        public Tiles type;
        public float height;
    }

    struct Drone
    {
        // TODO
    }

    public struct GameState
    {
        string name;
        Tile[][] tiles;
        Drone[] drones;
        int selected_drone;
        float zoom;
        float pitch;
        float rotation;

        public void UpdateTile(int x, int y, Tiles type)
        {
            this.tiles[x][y].type = type;
        }
    }
}
