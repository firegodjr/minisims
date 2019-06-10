import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../input/input.js";
import { Tiles, TILE_DEGRADE_TABLE } from "../constants.js";
import { ChangeSelectedEvent, AddDroneEvent } from "../event/events.js";
import { Table } from "../util/util.js";
var Coords = /** @class */ (function () {
    function Coords(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coords;
}());
var Tile = /** @class */ (function () {
    function Tile(type, color, stroke, density, height, height_variation, optimize, color_offset, grass_color) {
        this.type = type;
        this.color = color;
        this.stroke = stroke;
        this.density = density;
        this.height = height;
        this.height_variation = height_variation;
        this.optimize = optimize;
        this.color_offset = color_offset;
        this.grass_color = grass_color;
    }
    Tile.prototype.get_color = function () {
        if (this.color_offset !== undefined) {
            return varied_color({
                r: this.color.r + this.color_offset.r,
                g: this.color.g + this.color_offset.g,
                b: this.color.b + this.color_offset.b,
                v: this.color.v + this.color_offset.v
            });
        }
        else {
            return varied_color(this.color);
        }
    };
    return Tile;
}());
var TileCreator = /** @class */ (function () {
    function TileCreator() {
        this.colorTable = new Table([
            { key: Tiles.GRASS, value: { r: 35, g: 135, b: 43 } },
            { key: Tiles.WHEAT, value: { r: 100, g: 75, b: 45 } },
            { key: Tiles.WHEAT_RIPE, value: { r: 210, g: 155, b: 94 } },
            { key: Tiles.STONE, value: { r: 150, g: 150, b: 150, v: 5 } },
            { key: Tiles.ORE, value: { r: 80, g: 80, b: 80, v: 5 } },
            { key: Tiles.ORE_RIPE, value: { r: 80, g: 80, b: 80, v: 5 } },
            { key: Tiles.WATER, value: { r: 110, g: 210, b: 190, v: 0 } }
        ]);
        this.densityTable = new Table([
            { key: Tiles.GRASS, value: 8 },
            { key: Tiles.WHEAT_RIPE, value: 5 },
            { key: Tiles.ORE_RIPE, value: 2 },
            { key: Tiles.WHEAT, value: 0 },
            { key: Tiles.STONE, value: 0 },
            { key: Tiles.ORE, value: 0 },
            { key: Tiles.WATER, value: 0 }
        ]);
        this.heightTable = new Table([
            { key: Tiles.WHEAT_RIPE, value: 20 },
            { key: Tiles.GRASS, value: 10 }
        ]);
        this.variationTable = new Table([
            { key: Tiles.WHEAT_RIPE, value: 0.2 },
            { key: Tiles.GRASS, value: 1 },
        ]);
        this.grassColorTable = new Table([
            { key: Tiles.ORE_RIPE, value: "#930" }
        ]);
        this.optimizeTable = new Table([
            { key: Tiles.WHEAT_RIPE, value: false }
        ]);
    }
    TileCreator.prototype.create = function (type) {
        var tile = new Tile(type, this.colorTable.get(type), 4, this.densityTable.get(type), this.heightTable.get(type), this.variationTable.get(type), this.optimizeTable.get(type), undefined, this.grassColorTable.get(type));
        return tile;
    };
    return TileCreator;
}());
var GameState = /** @class */ (function () {
    function GameState() {
        this.m_tiles = [];
        this.m_drones = [];
        this.m_selected_drone = 0;
        this.m_zoom = 1;
        this.m_pitch = -Zdog.TAU / 12;
        this.m_rotation = -Zdog.TAU / 8;
        this.m_dirty_tiles = [];
        this.m_input_mgr = new InputManager();
        this.m_tile_creator = new TileCreator();
    }
    GameState.prototype.harvest = function (x, y) {
        this.m_tiles[x][y] = this.m_tile_creator.create(TILE_DEGRADE_TABLE.get(this.m_tiles[x][y].type));
        this.m_dirty_tiles.push(new Coords(x, y));
    };
    GameState.prototype.select_drone = function (index) {
        this.m_selected_drone = index;
        document.dispatchEvent(ChangeSelectedEvent(index));
    };
    GameState.prototype.add_drone = function (pos_x, pos_y) {
        if (pos_x === void 0) { pos_x = 0; }
        if (pos_y === void 0) { pos_y = 0; }
        if (this.m_tiles && this.m_tiles.length > 0) {
            pos_x = Math.floor(Math.random() * this.m_tiles.length);
            pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            while (this.m_tiles[pos_x][pos_y].type == Tiles.WATER) {
                pos_x = Math.floor(Math.random() * this.m_tiles.length);
                pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
            }
        }
        var drone_index = this.m_drones.length;
        this.m_drones.push(new Drone(drone_index, pos_x, pos_y, JobCitizen()));
        document.dispatchEvent(AddDroneEvent(pos_x, pos_y));
    };
    return GameState;
}());
function semi_random_color(r, g, b, variation) {
    if (variation === void 0) { variation = 10; }
    return "rgb(" + Zdog.lerp(r - variation, r + variation, Math.random()) + ", " + Zdog.lerp(g - variation, g + variation, Math.random()) + ", " + Zdog.lerp(b - variation, b + variation, Math.random());
}
function varied_color(color) {
    return semi_random_color(color.r, color.g, color.b, color.v);
}
export { Coords, GameState, Tile, TileCreator };
