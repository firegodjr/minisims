import { Table } from "./util/util.js";
/* Drone Goals */
var Goals;
(function (Goals) {
    Goals[Goals["NONE"] = 0] = "NONE";
    Goals[Goals["EAT"] = 1] = "EAT";
    Goals[Goals["HARVEST"] = 2] = "HARVEST";
    Goals[Goals["GIVE_ITEM"] = 3] = "GIVE_ITEM";
    Goals[Goals["CRAFT_ITEM"] = 4] = "CRAFT_ITEM";
})(Goals || (Goals = {}));
var GoalStrings = [
    "do nothing",
    "eat",
    "harvest",
    "give someone an item",
    "craft an item"
];
/* Tiles */
var Tiles;
(function (Tiles) {
    Tiles[Tiles["GRASS"] = 0] = "GRASS";
    Tiles[Tiles["WHEAT"] = 1] = "WHEAT";
    Tiles[Tiles["WHEAT_RIPE"] = 2] = "WHEAT_RIPE";
    Tiles[Tiles["STONE"] = 3] = "STONE";
    Tiles[Tiles["ORE"] = 4] = "ORE";
    Tiles[Tiles["ORE_RIPE"] = 5] = "ORE_RIPE";
    Tiles[Tiles["WATER"] = 6] = "WATER";
})(Tiles || (Tiles = {}));
var TileStrings = [
    "Grass",
    "Wheat",
    "Ripe Wheat",
    "Stone",
    "Ore",
    "Rich Ore"
];
var Items;
(function (Items) {
    Items[Items["NONE"] = 0] = "NONE";
    Items[Items["WHEAT"] = 1] = "WHEAT";
    Items[Items["ORE"] = 2] = "ORE";
})(Items || (Items = {}));
var ItemStrings = [
    "",
    "Wheat",
    "Ore"
];
var Deficits;
(function (Deficits) {
    Deficits[Deficits["NONE"] = 0] = "NONE";
    Deficits[Deficits["ENERGY"] = 1] = "ENERGY";
    Deficits[Deficits["LOW_CROP"] = 2] = "LOW_CROP";
    Deficits[Deficits["ENOUGH_CROP"] = 3] = "ENOUGH_CROP";
})(Deficits || (Deficits = {}));
var TILE_DEGRADE_TABLE = new Table([
    { key: Tiles.WHEAT_RIPE, value: Tiles.ORE_RIPE },
    { key: Tiles.WHEAT, value: Tiles.ORE }
]);
export { Goals, Tiles, Items, Deficits };
export { GoalStrings, TileStrings, ItemStrings };
export { TILE_DEGRADE_TABLE };
