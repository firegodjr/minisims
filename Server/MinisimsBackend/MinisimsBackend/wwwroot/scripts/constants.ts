import { Table, makePair } from "./util/table.js";

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
enum TileTypes
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

enum Jobs
{
    CIVILIAN
}

const TILE_DEGRADE_TABLE = new Table([
    { key: TileTypes.WHEAT_RIPE, value: TileTypes.ORE_RIPE}, 
    { key: TileTypes.WHEAT, value: TileTypes.ORE }
]);

const TILE_HARVEST_TABLE = new Table([
    makePair(TileTypes.WHEAT_RIPE, Items.WHEAT),
    makePair(TileTypes.ORE_RIPE, Items.ORE)
])

export { Goals, TileTypes, Items, Deficits, Jobs };
export { GoalStrings, TileStrings, ItemStrings };
export { TILE_DEGRADE_TABLE, TILE_HARVEST_TABLE };