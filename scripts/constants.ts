import { createTable } from "./util/util";

/* Drone Goals */
enum Goals
{
    NONE,
    EAT,
    HARVEST,
    GIVE_ITEM,
    CRAFT_ITEM
}

const GoalStrings = [
    "do nothing",
    "eat",
    "harvest",
    "give someone an item",
    "craft an item"
];

/* Tiles */
enum Tiles
{
    GRASS,
    WHEAT,
    WHEAT_RIPE,
    STONE,
    ORE,
    ORE_RIPE,
    WATER
}

const TileStrings = [
    "Grass",
    "Wheat",
    "Ripe Wheat",
    "Stone",
    "Ore",
    "Rich Ore"
];

enum Items
{
    NONE,
    WHEAT,
    ORE
}

const ItemStrings = [
    "",
    "Wheat",
    "Ore"
];

enum Deficits
{
    NONE,
    ENERGY,
    LOW_CROP,
    ENOUGH_CROP
}

const TILE_DEGRADE_TABLE = createTable(
    { inputs: [Tiles.WHEAT_RIPE, Tiles.ORE_RIPE], outputs: [Tiles.WHEAT, Tiles.ORE] });

export { Goals, Tiles, Items, Deficits };
export { GoalStrings, TileStrings, ItemStrings };
export { TILE_DEGRADE_TABLE };