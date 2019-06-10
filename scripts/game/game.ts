import { Drone } from "../drone";
import { JobCitizen } from "./jobs";
import { InputManager } from "../input/input.js";
import { Tiles, TILE_DEGRADE_TABLE } from "../constants";
import { ChangeSelectedEvent, AddDroneEvent } from "../event/events.js";
import { Zdog } from "../zDog/zdog.js";

interface ICoords
{
    x: number;
    y: number;
}

class Coords
{
    x: number;
    y: number;
    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}

class GameState
{
    m_tiles: Array<Array<Tiles>>;
    m_drones: Array<Drone>;
    m_selected_drone: number;
    m_zoom: number;
    m_pitch: number;
    m_rotation: number;
    m_dirty_tiles: Array<Coords> // coordinates of tiles that need to be refreshed
    m_input_mgr: InputManager;

    constructor()
    {
        this.m_tiles = [];
        this.m_drones = [];
        this.m_selected_drone = 0;
        this.m_zoom = 1;
        this.m_pitch = -Zdog.TAU / 12;
        this.m_rotation = -Zdog.TAU / 8;
        this.m_dirty_tiles = [];
        this.m_input_mgr = new InputManager();
    }

    harvest(x: number, y: number)
    {
        this.m_tiles[x][y] = TILE_DEGRADE_TABLE.get(this.m_tiles[x][y]);
        this.m_dirty_tiles.push(new Coords(x, y));
    }

    select_drone(index: number)
    {
        this.m_selected_drone = index;
        document.dispatchEvent(ChangeSelectedEvent(index));
    }

    add_drone(pos_x: number = 0, pos_y: number = 0)
    {
        if(this.m_tiles && this.m_tiles.length > 0)
        {
            pos_x = Math.floor(Math.random() * this.m_tiles.length);
            pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            
            while(this.m_tiles[pos_x][pos_y] == Tiles.WATER)
            {
                pos_x = Math.floor(Math.random() * this.m_tiles.length);
                pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            }
        }
        var drone_index = this.m_drones.length;
        this.m_drones.push(new Drone(drone_index, pos_x, pos_y, JobCitizen()));
        document.dispatchEvent(AddDroneEvent(pos_x, pos_y));
    }
}

export { Coords, ICoords, GameState };