import { Table, make_pair } from "./util/table.js";

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

enum Jobs
{
    CIVILIAN
}

const TILE_DEGRADE_TABLE = new Table([
    { key: Tiles.WHEAT_RIPE, value: Tiles.ORE_RIPE}, 
    { key: Tiles.WHEAT, value: Tiles.ORE }
]);

const TILE_HARVEST_TABLE = new Table([
    make_pair(Tiles.WHEAT_RIPE, Items.WHEAT),
    make_pair(Tiles.ORE_RIPE, Items.ORE)
])

export { Goals, Tiles, Items, Deficits, Jobs };
export { GoalStrings, TileStrings, ItemStrings };
export { TILE_DEGRADE_TABLE, TILE_HARVEST_TABLE };