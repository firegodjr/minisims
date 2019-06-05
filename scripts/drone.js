import { Goals, Deficits } from "./constants.js";
import { AddItemEvent, ChangeEnergyEvent } from "./event/events.js";

function InventoryPair(item, count)
{
    var self = this;
    self.m_item = item;
    self.m_count = count;
    
    return self;
}

export function Drone(index, pos_x, pos_y, job)
{
    var self = this;
    self.m_index = index;
    self.m_pos_x = pos_x;
    self.m_pos_y = pos_y;
    self.m_energy = 100;
    self.m_energy_threshold = 30; // Inclusive threshold for when this should create a goal
    self.m_inventory = [];
    self.m_job = job;
    self.m_goal = Goals.NONE;

    return self;
}

export function Dronef()
{
    var self = this;
    /**
     * Checks the drone for any deficits, and returns the one with highest priority
     */
    this.get_priority_deficit = function(drone){
        var energy_deficit = this.has_energy_deficit(drone, drone.m_energy_threshold);
        var crop_deficit = this.has_crop_deficit(drone, drone.m_crop_threshold);

        if(drone.m_job)
        {
            for(var i = 0; i < drone.m_job.m_deficit_priority.length; ++i)
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

    this.has_energy_deficit = function(drone, threshold)
    {
        return drone.m_energy <= drone.m_energy_threshold;
    }

    this.has_crop_deficit = function(drone, threshold)
    {
        return drone.m_inventory
    }

    this.set_goal_from_deficit = function(drone, game, deficit, change_event)
    {
        var initial_goal = drone.m_goal;
        if(deficit != Deficits.NONE)
        {
            drone.m_goal = drone.m_job.m_goal_table[deficit];
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

    this.to_index = function(drone, game)
    {
        var comp = function(val)
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
    this.find_in_inventory = function(drone, item)
    {
        var found_inv_pair = drone.m_inventory.findIndex(function(inv_pair){
            return inv_pair.m_item == item;
        });
        return found_inv_pair;
    }

    this.add_item = function(drone, item, count = 1)
    {
        var index = this.find_in_inventory(drone, item);
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

    this.change_energy = function(drone, change)
    {
        drone.m_energy += change;
        document.dispatchEvent(ChangeEnergyEvent(drone.m_index, change));
    }
}