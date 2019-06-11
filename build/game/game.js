import { Drone } from "../drone.js";
import { JobCitizen } from "./jobs.js";
import { InputManager } from "../io/input.js";
import { Tiles, TILE_DEGRADE_TABLE, Goals, Items } from "../constants.js";
import { ChangeSelectedEvent, AddDroneEvent, ChangeGoalEvent, TickEvent } from "../event/events.js";
import { Table } from "../util/util.js";
var Coords = /** @class */ (function () {
    function Coords(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coords;
}());
var Tile = /** @class */ (function () {
    function Tile(type, color, grass_stroke, grass_density, grass_height, height_variation, optimize_grass, height, color_offset, grass_color) {
        this.type = type;
        this.color = color;
        this.stroke = grass_stroke;
        this.height = height;
        this.grass_density = grass_density;
        this.grass_height = grass_height;
        this.grass_height_variation = height_variation;
        this.optimize_grass = optimize_grass;
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
            { key: Tiles.GRASS, value: { r: 35, g: 135, b: 43, v: 7 } },
            { key: Tiles.WHEAT, value: { r: 100, g: 75, b: 45 } },
            { key: Tiles.WHEAT_RIPE, value: { r: 210, g: 155, b: 94 } },
            { key: Tiles.STONE, value: { r: 150, g: 150, b: 150, v: 5 } },
            { key: Tiles.ORE, value: { r: 80, g: 80, b: 80, v: 5 } },
            { key: Tiles.ORE_RIPE, value: { r: 80, g: 80, b: 80, v: 5 } },
            { key: Tiles.WATER, value: { r: 110, g: 210, b: 190, v: 0 } }
        ]);
        this.densityTable = new Table([
            { key: Tiles.GRASS, value: 6 },
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
        var tile = new Tile(type, Object.assign({}, this.colorTable.get(type)), 4, this.densityTable.get(type), this.heightTable.get(type), this.variationTable.get(type), this.optimizeTable.get(type), 0, undefined, this.grassColorTable.get(type));
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
function update_ai(game, drone_helper) {
    for (var i = 0; i < game.m_drones.length; ++i) {
        // If the drone has no goal, we should give him one by checking his deficits
        if (game.m_drones[i].m_goal == Goals.NONE && game.m_drones[i].m_job) {
            var deficit = drone_helper.get_priority_deficit(game.m_drones[i]);
            drone_helper.set_goal_from_deficit(game.m_drones[i], game, deficit, ChangeGoalEvent);
        }
        var initial_goal = game.m_drones[i].m_goal;
        perform_goal(game.m_drones[i], drone_helper, game);
        if (initial_goal != game.m_drones[i].m_goal) {
            document.dispatchEvent(ChangeGoalEvent(i, game.m_drones[i].m_goal));
        }
    }
}
function do_tick(game, drone_helper) {
    update_ai(game, drone_helper);
    document.dispatchEvent(TickEvent());
}
var DRONE_HUNGER = 1; // Amount of food (wheat) each drone eats
var DRONE_ENERGY_RECOVER = 50; // Amount of energy recovered from eating TODO make random
function perform_goal(drone, drone_helper, game) {
    drone_helper.change_energy(drone, -10);
    if (drone.m_goal == Goals.EAT) {
        var wheat_index = drone_helper.find_in_inventory(drone, Items.WHEAT);
        if (drone.m_inventory[wheat_index] && drone.m_inventory[wheat_index].m_count >= DRONE_HUNGER) {
            drone_helper.add_item(drone, Items.WHEAT, -DRONE_HUNGER);
            drone_helper.change_energy(drone, DRONE_ENERGY_RECOVER);
            drone.m_goal = Goals.NONE;
        }
    }
    else if (drone.m_goal == Goals.HARVEST) {
        if (game.m_tiles[drone.m_pos_x][drone.m_pos_y].type == Tiles.WHEAT) {
            game.harvest(drone.m_pos_x, drone.m_pos_y);
            drone_helper.add_item(drone, Items.WHEAT, 1);
        }
        //TODO: pathfinding
    }
}
function semi_random_color(r, g, b, variation) {
    if (variation === void 0) { variation = 10; }
    return "rgb(" + Zdog.lerp(r - variation, r + variation, Math.random()) + ", " + Zdog.lerp(g - variation, g + variation, Math.random()) + ", " + Zdog.lerp(b - variation, b + variation, Math.random());
}
function varied_color(color) {
    return semi_random_color(color.r, color.g, color.b, color.v);
}
export { Coords, GameState, Tile, TileCreator, do_tick };
