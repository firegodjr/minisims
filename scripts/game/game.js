import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../input/input.js";
import { Tiles, TILE_DEGRADE_TABLE } from "../constants.js";
import { ChangeSelectedEvent } from "../event/events.js";

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
    
    return self;
}