import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../input/input.js";
import { Tiles } from "../constants.js";

export function GameState()
{
    var self = this;
    self.m_tiles = [];
    self.m_game_running = true;
    self.m_drones = [new Drone(0, 0, new JobCitizen())];
    self.m_selected_drone = 0;
    self.m_zoom = 1;
    self.m_pitch = -Zdog.TAU / 12;
    self.m_rotation = -Zdog.TAU / 8;
    self.m_dirty_tiles = []; // coordinates of tiles that need to be refreshed
    self.m_input_mgr = new InputManager();
}