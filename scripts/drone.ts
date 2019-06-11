import { Deficits, Goals, Items } from "./constants.js";
import { AddItemEvent, ChangeEnergyEvent } from "./event/events.js";
import { GameState } from "./game/game.js";
import { Job } from "./game/jobs.js";

class InventoryPair
{
    m_item: number;
    m_count: number;
    constructor(item: number, count: number)
    {
        this.m_item = item;
        this.m_count = count;
    }
}

class Drone
{
    m_index: number;
    m_pos_x: number;
    m_pos_y: number;
    m_energy: number;
    m_energy_threshold: number; // Inclusive threshold for when this should create a goal
    m_inventory: Array<InventoryPair>;
    m_job: Job;
    m_goal: Goals;
    m_moved: boolean;

    constructor(index: number, pos_x: number, pos_y: number, job: Job)
    {
        this.m_index = index;
        this.m_pos_x = pos_x;
        this.m_pos_y = pos_y;
        this.m_energy = 100;
        this.m_energy_threshold = 30;
        this.m_inventory = [];
        this.m_job = job;
        this.m_goal = Goals.NONE;
    }
}

class Dronef
{
    /**
     * Checks the drone for any deficits, and returns the one with highest priority
     */
    get_priority_deficit(drone: Drone){
        let energy_deficit = this.has_energy_deficit(drone, drone.m_energy_threshold);
        let crop_deficit = this.has_crop_deficit(drone, drone.m_job.m_crop_threshold);

        if(drone.m_job)
        {
            for(let i = 0; i < drone.m_job.m_deficit_priority.length; ++i)
            {
                if(drone.m_job.m_deficit_priority[i] === Deficits.ENERGY)
                {
                    // TODO there has to be a better way
                    if(energy_deficit)
                    {
                        return Deficits.ENERGY;
                    }
                }
                else if(drone.m_job.m_deficit_priority[i] === Deficits.LOW_CROP)
                {
                    // TODO there has to be a better way
                    if(crop_deficit)
                    {
                        return Deficits.LOW_CROP;
                    }
                }
                else if(drone.m_job.m_deficit_priority[i] === Deficits.ENOUGH_CROP)
                {
                    if(!crop_deficit)
                    {
                        return Deficits.ENOUGH_CROP;
                    }
                }
            }
        }

        return Deficits.NONE;
    }

    has_energy_deficit(drone: Drone, threshold: number)
    {
        return drone.m_energy <= drone.m_energy_threshold;
    }

    has_crop_deficit(drone: Drone, threshold: number)
    {
        return drone.m_inventory
    }

    set_goal_from_deficit(drone: Drone, game: GameState, deficit: Deficits, change_event: any)
    {
        let initial_goal = drone.m_goal;
        if(deficit != Deficits.NONE)
        {
            drone.m_goal = drone.m_job.m_goal_table.get(deficit);
        }
        else
        {
            drone.m_goal = Goals.NONE;
        }

        if(drone.m_goal != initial_goal)
        {
            document.dispatchEvent(change_event(this.to_index(drone, game), drone.m_goal));
        }
    }

    to_index(drone: Drone, game: GameState)
    {
        let comp = function(val: Drone)
        {
            return val == drone;
        }

        return game.m_drones.findIndex(comp);
    }

    /**
     * Finds the index of the given item
     * @param item the item to search for
     * @returns index of the item
     */
    find_in_inventory(drone: Drone, item: Items)
    {
        let found_inv_pair = drone.m_inventory.findIndex(function(inv_pair){
            return inv_pair.m_item == item;
        });
        return found_inv_pair;
    }

    add_item(drone: Drone, item: Items, count = 1)
    {
        let index = this.find_in_inventory(drone, item);
        if(index == -1)
        {
            // Don't allow adding negative items
            if(count >= 0)
            {
                index = drone.m_inventory.length;
                drone.m_inventory.push(new InventoryPair(item, count));
            }
        }
        else
        {
            drone.m_inventory[index].m_count += count;
        }

        if(index != -1 && drone.m_inventory[index].m_count == 0)
        {
            drone.m_inventory.splice(index, 1);
        }

        document.dispatchEvent(AddItemEvent(drone.m_index, item, count));
    }

    change_energy(drone: Drone, change: number)
    {
        drone.m_energy += change;
        document.dispatchEvent(ChangeEnergyEvent(drone.m_index, change));
    }

    move(drone: Drone, moveX: number, moveY: number)
    {
        drone.m_pos_x += moveX;
        drone.m_pos_y += moveY;
        drone.m_moved = true;
    }
}

export { Drone, Dronef as DroneHelper, InventoryPair };
