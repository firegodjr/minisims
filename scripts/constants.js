import { createTable } from "./util/util.js";

/* Drone Goals */
export const Goals = {
    NONE: 0,
    EAT: 1,
    HARVEST: 2,
    GIVE_ITEM: 3,
    CRAFT_ITEM: 4
}

export const GoalStrings = [
    "do nothing",
    "eat",
    "harvest",
    "give someone an item",
    "craft an item"
];
/* Tiles */
export const Tiles = {
    GRASS: 0,
    WHEAT: 1,
    WHEAT_RIPE: 2,
    STONE: 3,
    ORE: 4,
    ORE_RIPE: 5,
    WATER: 6
}

export const TileStrings = [
    "Grass",
    "Wheat",
    "Ripe Wheat",
    "Stone",
    "Ore",
    "Rich Ore"
];

export const Items = {
    NONE: 0,
    WHEAT: 1,
    ORE: 2
}

export const ItemStrings = [
    "",
    "Wheat",
    "Ore"
];

export const Deficits = {
    NONE: -1,
    ENERGY: 0,
    LOW_CROP: 1,
    ENOUGH_CROP: 2
}

export const TILE_DEGRADE_TABLE = createTable(
    [Tiles.WHEAT_RIPE, Tiles.ORE_RIPE],
    [Tiles.WHEAT, Tiles.ORE]
);