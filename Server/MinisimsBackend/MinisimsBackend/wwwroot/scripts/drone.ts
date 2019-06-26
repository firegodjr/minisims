import { Deficits, Goals, Items, Jobs } from "./constants.js";
import { AddItemEvent, ChangeEnergyEvent } from "./event/events.js";
import { GameState } from "./game/game.js";
import { Job } from "./game/jobs.js";

/**
 * An item/count pair for storing items in inventory
 */
class InventoryPair
{
    item: number;
    count: number;
    constructor(item: number, count: number)
    {
        this.item = item;
        this.count = count;
    }
}

interface DroneDTO
{
    index: number;
    posX: number;
    posY: number;
    energy: number;
    energyThreshold: number; // Inclusive threshold for when this should create a goal
    inventory: Array<InventoryPair>;
    job: Job;
    goal: Goals;
}

/**
 * A grid-based entity that uses goals to remedy deficits.
 */
class Drone
{
    index: number;
    posX: number;
    posY: number;
    energy: number;
    energyThreshold: number; // Inclusive threshold for when this should create a goal
    inventory: Array<InventoryPair>;
    job: Job;
    goal: Goals;
    moved: boolean;

    constructor(index: number, pos_x: number, pos_y: number, job: Job)
    {
        this.index = index;
        this.posX = pos_x;
        this.posY = pos_y;
        this.energy = 100;
        this.energyThreshold = 30;
        this.inventory = [];
        this.job = job;
        this.goal = Goals.NONE;
    }
}

class Dronef
{
    /**
     * Checks the drone for any deficits, and returns the one with highest priority
     */
    get_priority_deficit(drone: Drone){
        let energyDeficit = this.hasEnergyDeficit(drone, drone.energyThreshold);
        let cropDeficit = this.hasCropDeficit(drone, drone.job.cropThreshold);

        if(drone.job)
        {
            for(let i = 0; i < drone.job.deficitPriority.length; ++i)
            {
                if(drone.job.deficitPriority[i] === Deficits.ENERGY)
                {
                    // TODO there has to be a better way
                    if(energyDeficit)
                    {
                        return Deficits.ENERGY;
                    }
                }
                else if(drone.job.deficitPriority[i] === Deficits.LOW_CROP)
                {
                    // TODO there has to be a better way
                    if(cropDeficit)
                    {
                        return Deficits.LOW_CROP;
                    }
                }
                else if(drone.job.deficitPriority[i] === Deficits.ENOUGH_CROP)
                {
                    if(!cropDeficit)
                    {
                        return Deficits.ENOUGH_CROP;
                    }
                }
            }
        }

        return Deficits.NONE;
    }

    /**
     * Checks a drone for an energy deficit
     * @param drone 
     * @param threshold 
     */
    hasEnergyDeficit(drone: Drone, threshold: number)
    {
        return drone.energy <= threshold;
    }

    /**
     * Checks a drone for a crop deficit
     * @param drone 
     * @param threshold 
     */
    hasCropDeficit(drone: Drone, threshold: number)
    {
        return drone.inventory
    }

    /**
     * Sets a drone's goal based on its deficit
     * @param drone 
     * @param game 
     * @param deficit 
     * @param changeEvent 
     */
    setGoalFromDeficit(drone: Drone, game: GameState, deficit: Deficits, changeEvent: any)
    {
        let initialGoal = drone.goal;
        if(deficit != Deficits.NONE)
        {
            drone.goal = drone.job.goalTable.get(deficit);
        }
        else
        {
            drone.goal = Goals.NONE;
        }

        if(drone.goal != initialGoal)
        {
            document.dispatchEvent(changeEvent(this.toIndex(drone, game), drone.goal));
        }
    }

    /**
     * Gets the index of this drone in the GameState
     * @param drone 
     * @param game 
     */
    toIndex(drone: Drone, game: GameState)
    {
        let comp = function(val: Drone)
        {
            return val == drone;
        }

        return game.drones.findIndex(comp);
    }

    /**
     * Finds the index of the given item
     * @param item the item to search for
     * @returns index of the item
     */
    findInInventory(drone: Drone, item: Items)
    {
        let foundInvPair = drone.inventory.findIndex(function(invPair){
            return invPair.item == item;
        });
        return foundInvPair;
    }

    /**
     * Adds or subtracts n items to/from a drone's inventory
     * @param drone 
     * @param item 
     * @param count 
     */
    addItem(drone: Drone, item: Items, count = 1)
    {
        let index = this.findInInventory(drone, item);
        if(index == -1)
        {
            // Don't allow adding negative items
            if(count >= 0)
            {
                index = drone.inventory.length;
                drone.inventory.push(new InventoryPair(item, count));
            }
        }
        else
        {
            drone.inventory[index].count += count;
        }

        if(index != -1 && drone.inventory[index].count == 0)
        {
            drone.inventory.splice(index, 1);
        }

        document.dispatchEvent(AddItemEvent(drone.index, item, count));
    }

    /**
     * Applies a positive or negative change to a drone's energy count
     * @param drone 
     * @param change 
     */
    changeEnergy(drone: Drone, change: number)
    {
        drone.energy += change;
        document.dispatchEvent(ChangeEnergyEvent(drone.index, change));
    }

    /**
     * Moves a drone n units in the x and y directions
     * @param drone 
     * @param moveX 
     * @param moveY 
     */
    move(drone: Drone, moveX: number, moveY: number)
    {
        drone.posX += moveX;
        drone.posY += moveY;
        drone.moved = true;
    }

    serialize(drone: Drone)
    {
        let droneDTO: DroneDTO;

        droneDTO.index = drone.index;
        droneDTO.posX = drone.posX;
        droneDTO.posY = drone.posY;
        droneDTO.energy = drone.energy;
        droneDTO.energyThreshold = drone.energyThreshold;
        droneDTO.inventory = drone.inventory;
        droneDTO.goal = drone.goal;
    }
}

export { Drone, Dronef as DroneHelper, InventoryPair };
