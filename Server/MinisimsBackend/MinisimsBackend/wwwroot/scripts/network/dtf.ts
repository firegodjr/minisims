import { Tiles } from "../constants.js";
import { SerialGameState, SerialTile } from "../game/game.js";
import { Drone } from "../drone.js";

export interface TileUpdateDTF
{
    x: number;
    y: number;
    type: Tiles;
}

export class TileUpdateDTF
{
    x: number;
    y: number;
    type: Tiles;

    constructor(x: number, y: number, type: Tiles)
    {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

/**
 * The bare essentials required to (de)serialize a GameState object
 */
export interface GameStateDTF
{
    name: string;
    tiles: Array<Array<SerialTile>>;
    drones: Array<Drone>;
    selectedDrone: number;
}