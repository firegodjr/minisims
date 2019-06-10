import { Goals, Deficits } from "./constants.js";
import { ChangeEnergyEvent, AddItemEvent } from "./event/events.js";
var InventoryPair = /** @class */ (function () {
    function InventoryPair(item, count) {
        this.m_item = item;
        this.m_count = count;
    }
    return InventoryPair;
}());
var Drone = /** @class */ (function () {
    function Drone(index, pos_x, pos_y, job) {
        this.m_index = index;
        this.m_pos_x = pos_x;
        this.m_pos_y = pos_y;
        this.m_energy = 100;
        this.m_energy_threshold = 30;
        this.m_inventory = [];
        this.m_job = job;
        this.m_goal = Goals.NONE;
    }
    return Drone;
}());
var Dronef = /** @class */ (function () {
    function Dronef() {
    }
    /**
     * Checks the drone for any deficits, and returns the one with highest priority
     */
    Dronef.prototype.get_priority_deficit = function (drone) {
        var energy_deficit = this.has_energy_deficit(drone, drone.m_energy_threshold);
        var crop_deficit = this.has_crop_deficit(drone, drone.m_job.m_crop_threshold);
        if (drone.m_job) {
            for (var i = 0; i < drone.m_job.m_deficit_priority.length; ++i) {
                if (drone.m_job.m_deficit_priority[i] === Deficits.ENERGY) {
                    // TODO there has to be a better way
                    if (energy_deficit) {
                        return Deficits.ENERGY;
                    }
                }
                else if (drone.m_job.m_deficit_priority[i] === Deficits.LOW_CROP) {
                    // TODO there has to be a better way
                    if (crop_deficit) {
                        return Deficits.LOW_CROP;
                    }
                }
                else if (drone.m_job.m_deficit_priority[i] === Deficits.ENOUGH_CROP) {
                    if (!crop_deficit) {
                        return Deficits.ENOUGH_CROP;
                    }
                }
            }
        }
        return Deficits.NONE;
    };
    Dronef.prototype.has_energy_deficit = function (drone, threshold) {
        return drone.m_energy <= drone.m_energy_threshold;
    };
    Dronef.prototype.has_crop_deficit = function (drone, threshold) {
        return drone.m_inventory;
    };
    Dronef.prototype.set_goal_from_deficit = function (drone, game, deficit, change_event) {
        var initial_goal = drone.m_goal;
        if (deficit != Deficits.NONE) {
            drone.m_goal = drone.m_job.m_goal_table.get(deficit);
        }
        else {
            drone.m_goal = Goals.NONE;
        }
        if (drone.m_goal != initial_goal) {
            document.dispatchEvent(change_event(this.to_index(drone, game), drone.m_goal));
        }
    };
    Dronef.prototype.to_index = function (drone, game) {
        var comp = function (val) {
            return val == drone;
        };
        return game.m_drones.findIndex(comp);
    };
    /**
     * Finds the index of the given item
     * @param item the item to search for
     * @returns index of the item
     */
    Dronef.prototype.find_in_inventory = function (drone, item) {
        var found_inv_pair = drone.m_inventory.findIndex(function (inv_pair) {
            return inv_pair.m_item == item;
        });
        return found_inv_pair;
    };
    Dronef.prototype.add_item = function (drone, item, count) {
        if (count === void 0) { count = 1; }
        var index = this.find_in_inventory(drone, item);
        if (index == -1) {
            // Don't allow adding negative items
            if (count >= 0) {
                index = drone.m_inventory.length;
                drone.m_inventory.push(new InventoryPair(item, count));
            }
        }
        else {
            drone.m_inventory[index].m_count += count;
        }
        if (index != -1 && drone.m_inventory[index].m_count == 0) {
            drone.m_inventory.splice(index, 1);
        }
        document.dispatchEvent(AddItemEvent(drone.m_index, item, count));
    };
    Dronef.prototype.change_energy = function (drone, change) {
        drone.m_energy += change;
        document.dispatchEvent(ChangeEnergyEvent(drone.m_index, change));
    };
    return Dronef;
}());
export { Drone, Dronef as DroneHelper, InventoryPair };
