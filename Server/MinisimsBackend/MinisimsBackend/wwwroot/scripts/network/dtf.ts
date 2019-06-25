import { Tiles } from "../constants.js";

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