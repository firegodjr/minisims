import { TileTypes } from "../constants.js";
import { GameStateDTO, SerialTile } from "../game/game.js";
import { Drone } from "../drone.js";

export interface TileUpdateDTO
{
    x: number;
    y: number;
    type: TileTypes;
}

export class TileUpdateDTO
{
    x: number;
    y: number;
    type: TileTypes;

    constructor(x: number, y: number, type: TileTypes)
    {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

/**
 * The bare essentials required to (de)serialize a GameState object
 */
export interface GameStateDTO
{
    name: string;
    tiles: Array<Array<SerialTile>>;
    drones: Array<Drone>;
    selectedDrone: number;
}