define("util/util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createTable(inputs, outputs) {
        var table = {};
        for (var i = 0; i < inputs.length; ++i) {
            table[inputs[i]] = outputs[i];
        }
        return table;
    }
    exports.createTable = createTable;
});
define("constants", ["require", "exports", "util/util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Goals;
    (function (Goals) {
        Goals[Goals["NONE"] = 0] = "NONE";
        Goals[Goals["EAT"] = 1] = "EAT";
        Goals[Goals["HARVEST"] = 2] = "HARVEST";
        Goals[Goals["GIVE_ITEM"] = 3] = "GIVE_ITEM";
        Goals[Goals["CRAFT_ITEM"] = 4] = "CRAFT_ITEM";
    })(Goals || (Goals = {}));
    exports.Goals = Goals;
    var GoalStrings = [
        "do nothing",
        "eat",
        "harvest",
        "give someone an item",
        "craft an item"
    ];
    exports.GoalStrings = GoalStrings;
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
    exports.Tiles = Tiles;
    var TileStrings = [
        "Grass",
        "Wheat",
        "Ripe Wheat",
        "Stone",
        "Ore",
        "Rich Ore"
    ];
    exports.TileStrings = TileStrings;
    var Items;
    (function (Items) {
        Items[Items["NONE"] = 0] = "NONE";
        Items[Items["WHEAT"] = 1] = "WHEAT";
        Items[Items["ORE"] = 2] = "ORE";
    })(Items || (Items = {}));
    exports.Items = Items;
    var ItemStrings = [
        "",
        "Wheat",
        "Ore"
    ];
    exports.ItemStrings = ItemStrings;
    var Deficits;
    (function (Deficits) {
        Deficits[Deficits["NONE"] = 0] = "NONE";
        Deficits[Deficits["ENERGY"] = 1] = "ENERGY";
        Deficits[Deficits["LOW_CROP"] = 2] = "LOW_CROP";
        Deficits[Deficits["ENOUGH_CROP"] = 3] = "ENOUGH_CROP";
    })(Deficits || (Deficits = {}));
    exports.Deficits = Deficits;
    var TILE_DEGRADE_TABLE = util_1.createTable([Tiles.WHEAT_RIPE, Tiles.ORE_RIPE], [Tiles.WHEAT, Tiles.ORE]);
    exports.TILE_DEGRADE_TABLE = TILE_DEGRADE_TABLE;
});
