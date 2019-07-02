import { Deficits, Goals, Items, Jobs } from "./constants.js";
import { AddItemEvent, ChangeEnergyEvent } from "./event/events.js";
import { GameState } from "./game/game.js";
import { Job } from "./game/jobs.js";
import { Table } from "./util/table.js";

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

export enum StatTypes
{
    WHEAT,
    ORE,
    ENERGY
}

interface DroneStatChangeDTO
{
    statType: number;
    valueChange: number;
}

interface DroneUpdateDTO
{
    name: string;
    x: number;
    y: number;
    stats: DroneStatChangeDTO[];
}

/**
 * A grid-based entity that uses goals to remedy deficits.
 */
class Drone
{
    name: string;
    posX: number;
    posY: number;
    stats: Table<number>;
    moved: boolean = false;

    constructor(update: DroneUpdateDTO)
    {
        this.name = update.name;
        this.posX = update.x;
        this.posY = update.y;
        this.stats = new Table();

        for (let i = 0; i < update.stats.length; ++i)
        {
            this.stats.set(update.stats[i].statType, update.stats[i].valueChange);
        }
    }
}

class Dronef
{

    /**
     * Finds the index of the given item
     * @param item the item to search for
     * @returns InventoryPair of the item
     */
    findInInventory(drone: Drone, item: StatTypes)
    {
        let itemCount = drone.stats[item];
        return new InventoryPair(item, itemCount);
    }

    /**
     * Adds or subtracts n items to/from a drone's inventory
     * @param drone 
     * @param item 
     * @param count 
     */
    addItem(drone: Drone, item: StatTypes, count = 1)
    {
        if (!drone.stats.keys().includes(item + "")) {
            drone.stats.set(item, count);
        }
        else drone.stats[item] += count;

        document.dispatchEvent(AddItemEvent(drone.name, item, count));
    }

    /**
     * Applies a positive or negative change to a drone's energy count
     * @param drone 
     * @param change 
     */
    changeEnergy(drone: Drone, change: number)
    {
        drone.stats[StatTypes.ENERGY] += change;
        document.dispatchEvent(ChangeEnergyEvent(drone.name, change));
    }

    /**
     * Moves a drone to the given position
     * @param drone 
     * @param moveX 
     * @param moveY 
     */
    move(drone: Drone, moveX: number, moveY: number)
    {
        drone.posX = moveX;
        drone.posY = moveY;
    }

    serialize(drone: Drone)
    {
        let droneDTO: DroneUpdateDTO;

        droneDTO.name = drone.name;
        droneDTO.x = drone.posX;
        droneDTO.y = drone.posY;

        let statChanges: DroneStatChangeDTO[] = [];
        for (let i = 0; i < drone.stats.keys.length; ++i)
        {
            statChanges.push(
                {
                    statType: drone.stats.keys[i],
                    valueChange: drone.stats[drone.stats.keys[i]]
                });
        }
        droneDTO.stats = statChanges;

        return droneDTO;
    }
}

export { Drone, Dronef as DroneHelper, InventoryPair };
