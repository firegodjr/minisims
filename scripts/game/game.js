import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../input/input.js";
import { Tiles, TILE_DEGRADE_TABLE } from "../constants.js";
import { ChangeSelectedEvent, AddDroneEvent } from "../event/events.js";

export function GameState()
{
    var self = this;
    self.m_tiles = [];
    self.m_game_running = true;
    self.m_drones = [];
    self.m_selected_drone = 0;
    self.m_zoom = 1;
    self.m_pitch = -Zdog.TAU / 12;
    self.m_rotation = -Zdog.TAU / 8;
    self.m_dirty_tiles = []; // coordinates of tiles that need to be refreshed
    self.m_input_mgr = new InputManager();

    self.harvest = function(x, y)
    {
        self.m_tiles[x][y] = TILE_DEGRADE_TABLE[self.m_tiles[x][y]];
        self.m_dirty_tiles.push(x, y);
    }

    self.select_drone = function(index)
    {
        self.m_selected_drone = index;
        document.dispatchEvent(ChangeSelectedEvent(index));
    }

    self.add_drone = function(pos_x = 0, pos_y = 0)
    {
        if(self.m_tiles && self.m_tiles.length > 0)
        {
            pos_x = Math.floor(Math.random() * self.m_tiles.length);
            pos_y = Math.floor(Math.random() * self.m_tiles[0].length);
            
            while(self.m_tiles[pos_x][pos_y] == Tiles.WATER)
            {
                pos_x = Math.floor(Math.random() * self.m_tiles.length);
                pos_y = Math.floor(Math.random() * self.m_tiles[0].length);
            }
        }
        var drone_index = self.m_drones.length;
        self.m_drones.push(new Drone(drone_index, pos_x, pos_y, new JobCitizen()));
        document.dispatchEvent(AddDroneEvent(pos_x, pos_y));
    }
    
    return self;
}