System.register("util/util", [], function (exports_1, context_1) {
    "use strict";
    var Table;
    var __moduleName = context_1 && context_1.id;
    /* Allows creating a goal table more intuitively, rather than using hard code */
    function createTable(inputs, outputs) {
        var table = new Table();
        for (var i = 0; i < inputs.length; ++i) {
            table.add(inputs[i], outputs[i]);
        }
        return table;
    }
    exports_1("createTable", createTable);
    return {
        setters: [],
        execute: function () {
            Table = class Table {
                add(key, val) {
                    while (this.arr.length <= key) {
                        this.arr.push(null);
                    }
                    if (!this.keys.includes(key)) {
                        this.keys.push(key);
                    }
                    this.arr[key] = val;
                }
                get(key) {
                    if (key >= 0 && key < this.arr.length) {
                        return this.arr[key];
                    }
                    else
                        return null;
                }
            };
            exports_1("Table", Table);
        }
    };
});
System.register("constants", ["util/util"], function (exports_2, context_2) {
    "use strict";
    var util_1, Goals, GoalStrings, Tiles, TileStrings, Items, ItemStrings, Deficits, TILE_DEGRADE_TABLE;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (util_1_1) {
                util_1 = util_1_1;
            }
        ],
        execute: function () {
            /* Drone Goals */
            (function (Goals) {
                Goals[Goals["NONE"] = 0] = "NONE";
                Goals[Goals["EAT"] = 1] = "EAT";
                Goals[Goals["HARVEST"] = 2] = "HARVEST";
                Goals[Goals["GIVE_ITEM"] = 3] = "GIVE_ITEM";
                Goals[Goals["CRAFT_ITEM"] = 4] = "CRAFT_ITEM";
            })(Goals || (Goals = {}));
            exports_2("Goals", Goals);
            GoalStrings = [
                "do nothing",
                "eat",
                "harvest",
                "give someone an item",
                "craft an item"
            ];
            exports_2("GoalStrings", GoalStrings);
            /* Tiles */
            (function (Tiles) {
                Tiles[Tiles["GRASS"] = 0] = "GRASS";
                Tiles[Tiles["WHEAT"] = 1] = "WHEAT";
                Tiles[Tiles["WHEAT_RIPE"] = 2] = "WHEAT_RIPE";
                Tiles[Tiles["STONE"] = 3] = "STONE";
                Tiles[Tiles["ORE"] = 4] = "ORE";
                Tiles[Tiles["ORE_RIPE"] = 5] = "ORE_RIPE";
                Tiles[Tiles["WATER"] = 6] = "WATER";
            })(Tiles || (Tiles = {}));
            exports_2("Tiles", Tiles);
            TileStrings = [
                "Grass",
                "Wheat",
                "Ripe Wheat",
                "Stone",
                "Ore",
                "Rich Ore"
            ];
            exports_2("TileStrings", TileStrings);
            (function (Items) {
                Items[Items["NONE"] = 0] = "NONE";
                Items[Items["WHEAT"] = 1] = "WHEAT";
                Items[Items["ORE"] = 2] = "ORE";
            })(Items || (Items = {}));
            exports_2("Items", Items);
            ItemStrings = [
                "",
                "Wheat",
                "Ore"
            ];
            exports_2("ItemStrings", ItemStrings);
            (function (Deficits) {
                Deficits[Deficits["NONE"] = 0] = "NONE";
                Deficits[Deficits["ENERGY"] = 1] = "ENERGY";
                Deficits[Deficits["LOW_CROP"] = 2] = "LOW_CROP";
                Deficits[Deficits["ENOUGH_CROP"] = 3] = "ENOUGH_CROP";
            })(Deficits || (Deficits = {}));
            exports_2("Deficits", Deficits);
            TILE_DEGRADE_TABLE = util_1.createTable([Tiles.WHEAT_RIPE, Tiles.ORE_RIPE], [Tiles.WHEAT, Tiles.ORE]);
            exports_2("TILE_DEGRADE_TABLE", TILE_DEGRADE_TABLE);
        }
    };
});
System.register("game/jobs", ["util/util", "constants"], function (exports_3, context_3) {
    "use strict";
    var util_2, constants_1, Job;
    var __moduleName = context_3 && context_3.id;
    function JobCitizen() {
        return new Job(util_2.createTable([constants_1.Deficits.ENERGY], [constants_1.Goals.EAT]), [constants_1.Deficits.ENERGY], constants_1.Items.NONE, false, 0);
    }
    exports_3("JobCitizen", JobCitizen);
    return {
        setters: [
            function (util_2_1) {
                util_2 = util_2_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            }
        ],
        execute: function () {
            /**
             * Constructor. A task assigned to a drone.
             * @param {Object} goal_table a table of goals from deficits
             * @param {Array<number>} deficit_priority an array of deficits in order of priority
             * @param {number} crop_needed the crop that a drone with this job can have a deficit in TODO need more crops at once
             * @param {boolean} [do_tile_harvest] whether or not this job requires the drone to personally harvest ripe tiles
             * @param {number} [crop_threshold] the maximum amount of crops that will return a deficit
             * @returns {Job}
             */
            Job = class Job {
                constructor(goal_table, deficit_priority, crop_needed, do_tile_harvest, crop_threshold) {
                    this.m_crop = crop_needed;
                    this.m_crop_threshold = crop_threshold;
                    this.m_do_harvest = do_tile_harvest;
                    this.m_goal_table = goal_table;
                    this.m_deficit_priority = deficit_priority;
                }
            };
            exports_3("Job", Job);
        }
    };
});
System.register("input/input", [], function (exports_4, context_4) {
    "use strict";
    var InputManager, InputManagerf;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            InputManager = class InputManager {
                constructor(keys = []) {
                    this.m_keys = keys;
                    this.m_keystates = {
                        "SHIFT": false,
                        "CTRL": false
                    };
                    if (keys.length > 0) {
                        for (let i = 0; i < keys.length; ++i) {
                            this.m_keystates[keys[i]] = false;
                        }
                    }
                }
            };
            exports_4("InputManager", InputManager);
            InputManagerf = class InputManagerf {
                set_keys(im, keys) {
                    im.m_keys = keys;
                    for (var i = 0; i < keys.length; ++i) {
                        im.m_keystates[keys[i]] = false;
                    }
                }
            };
            exports_4("InputManagerHelper", InputManagerf);
        }
    };
});
System.register("event/events", [], function (exports_5, context_5) {
    "use strict";
    var Events;
    var __moduleName = context_5 && context_5.id;
    function AddDroneEvent(pos_x, pos_y) {
        var self = this;
        self = new CustomEvent(Events.ADD_DRONE, { detail: { pos_x: pos_x, pos_y: pos_y } });
        return self;
    }
    exports_5("AddDroneEvent", AddDroneEvent);
    function AddItemEvent(drone, item, count) {
        var self = this;
        self = new CustomEvent(Events.ADD_ITEM, { detail: { drone: drone, item: item, count: count } });
        return self;
    }
    exports_5("AddItemEvent", AddItemEvent);
    function TickEvent() {
        var self = this;
        self = new CustomEvent(Events.ON_TICK);
        return self;
    }
    exports_5("TickEvent", TickEvent);
    function ChangeEnergyEvent(drone, amount) {
        var self = this;
        self = new CustomEvent(Events.CHANGE_ENERGY, { detail: { drone: drone, amount: amount } });
        return self;
    }
    exports_5("ChangeEnergyEvent", ChangeEnergyEvent);
    function ChangeSelectedEvent(drone) {
        var self = this;
        self = new CustomEvent(Events.CHANGE_SELECTED, { detail: { drone: drone } });
        return self;
    }
    exports_5("ChangeSelectedEvent", ChangeSelectedEvent);
    function ChangeGoalEvent(drone, goal) {
        var self = this;
        self = new CustomEvent(Events.CHANGE_GOAL, { detail: { drone: drone, goal: goal } });
        return self;
    }
    exports_5("ChangeGoalEvent", ChangeGoalEvent);
    function RenderEvent(game, delta) {
        var self = this;
        self = new CustomEvent(Events.RENDER, { detail: { game: game, delta: delta } });
        return self;
    }
    exports_5("RenderEvent", RenderEvent);
    return {
        setters: [],
        execute: function () {
            exports_5("Events", Events = {
                ADD_DRONE: "adddrone",
                ADD_ITEM: "additem",
                ON_TICK: "tick",
                CHANGE_ENERGY: "chgenergy",
                CHANGE_SELECTED: "chgselected",
                CHANGE_GOAL: "chggoal",
                RENDER: "render"
            });
        }
    };
});
System.register("game/game", ["drone", "game/jobs", "input/input", "constants", "event/events", "../../node_modules/zdog/dist/zdog.dist.js"], function (exports_6, context_6) {
    "use strict";
    var drone_1, jobs_1, input_js_1, constants_2, events_js_1, zdog_dist_js_1, Coords, GameState;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (drone_1_1) {
                drone_1 = drone_1_1;
            },
            function (jobs_1_1) {
                jobs_1 = jobs_1_1;
            },
            function (input_js_1_1) {
                input_js_1 = input_js_1_1;
            },
            function (constants_2_1) {
                constants_2 = constants_2_1;
            },
            function (events_js_1_1) {
                events_js_1 = events_js_1_1;
            },
            function (zdog_dist_js_1_1) {
                zdog_dist_js_1 = zdog_dist_js_1_1;
            }
        ],
        execute: function () {
            Coords = class Coords {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            };
            exports_6("Coords", Coords);
            GameState = class GameState {
                constructor() {
                    this.m_tiles = [];
                    this.m_drones = [];
                    this.m_selected_drone = 0;
                    this.m_zoom = 1;
                    this.m_pitch = -zdog_dist_js_1.Zdog.TAU / 12;
                    this.m_rotation = -zdog_dist_js_1.Zdog.TAU / 8;
                    this.m_dirty_tiles = [];
                    this.m_input_mgr = new input_js_1.InputManager();
                }
                harvest(x, y) {
                    this.m_tiles[x][y] = constants_2.TILE_DEGRADE_TABLE.get(this.m_tiles[x][y]);
                    this.m_dirty_tiles.push(new Coords(x, y));
                }
                select_drone(index) {
                    this.m_selected_drone = index;
                    document.dispatchEvent(events_js_1.ChangeSelectedEvent(index));
                }
                add_drone(pos_x = 0, pos_y = 0) {
                    if (this.m_tiles && this.m_tiles.length > 0) {
                        pos_x = Math.floor(Math.random() * this.m_tiles.length);
                        pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
                        while (this.m_tiles[pos_x][pos_y] == constants_2.Tiles.WATER) {
                            pos_x = Math.floor(Math.random() * this.m_tiles.length);
                            pos_y = Math.floor(Math.random() * this.m_tiles[0].length);
                        }
                    }
                    var drone_index = this.m_drones.length;
                    this.m_drones.push(new drone_1.Drone(drone_index, pos_x, pos_y, jobs_1.JobCitizen()));
                    document.dispatchEvent(events_js_1.AddDroneEvent(pos_x, pos_y));
                }
            };
            exports_6("GameState", GameState);
        }
    };
});
System.register("drone", ["constants", "event/events"], function (exports_7, context_7) {
    "use strict";
    var constants_3, events_1, InventoryPair, Drone, Dronef;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (constants_3_1) {
                constants_3 = constants_3_1;
            },
            function (events_1_1) {
                events_1 = events_1_1;
            }
        ],
        execute: function () {
            InventoryPair = class InventoryPair {
                constructor(item, count) {
                    this.m_item = item;
                    this.m_count = count;
                }
            };
            exports_7("InventoryPair", InventoryPair);
            Drone = class Drone {
                constructor(index, pos_x, pos_y, job) {
                    this.m_index = index;
                    this.m_pos_x = pos_x;
                    this.m_pos_y = pos_y;
                    this.m_energy = 100;
                    this.m_energy_threshold = 30;
                    this.m_inventory = [];
                    this.m_job = job;
                    this.m_goal = constants_3.Goals.NONE;
                }
            };
            exports_7("Drone", Drone);
            Dronef = class Dronef {
                /**
                 * Checks the drone for any deficits, and returns the one with highest priority
                 */
                get_priority_deficit(drone) {
                    let energy_deficit = this.has_energy_deficit(drone, drone.m_energy_threshold);
                    let crop_deficit = this.has_crop_deficit(drone, drone.m_job.m_crop_threshold);
                    if (drone.m_job) {
                        for (let i = 0; i < drone.m_job.m_deficit_priority.length; ++i) {
                            if (drone.m_job.m_deficit_priority[i] === constants_3.Deficits.ENERGY) {
                                // TODO there has to be a better way
                                if (energy_deficit) {
                                    return constants_3.Deficits.ENERGY;
                                }
                            }
                            else if (drone.m_job.m_deficit_priority[i] === constants_3.Deficits.LOW_CROP) {
                                // TODO there has to be a better way
                                if (crop_deficit) {
                                    return constants_3.Deficits.LOW_CROP;
                                }
                            }
                            else if (drone.m_job.m_deficit_priority[i] === constants_3.Deficits.ENOUGH_CROP) {
                                if (!crop_deficit) {
                                    return constants_3.Deficits.ENOUGH_CROP;
                                }
                            }
                        }
                    }
                    return constants_3.Deficits.NONE;
                }
                has_energy_deficit(drone, threshold) {
                    return drone.m_energy <= drone.m_energy_threshold;
                }
                has_crop_deficit(drone, threshold) {
                    return drone.m_inventory;
                }
                set_goal_from_deficit(drone, game, deficit, change_event) {
                    let initial_goal = drone.m_goal;
                    if (deficit != constants_3.Deficits.NONE) {
                        drone.m_goal = drone.m_job.m_goal_table.get(deficit);
                    }
                    else {
                        drone.m_goal = constants_3.Goals.NONE;
                    }
                    if (drone.m_goal != initial_goal) {
                        document.dispatchEvent(change_event(this.to_index(drone, game), drone.m_goal));
                    }
                }
                to_index(drone, game) {
                    let comp = function (val) {
                        return val == drone;
                    };
                    return game.m_drones.findIndex(comp);
                }
                /**
                 * Finds the index of the given item
                 * @param item the item to search for
                 * @returns index of the item
                 */
                find_in_inventory(drone, item) {
                    let found_inv_pair = drone.m_inventory.findIndex(function (inv_pair) {
                        return inv_pair.m_item == item;
                    });
                    return found_inv_pair;
                }
                add_item(drone, item, count = 1) {
                    let index = this.find_in_inventory(drone, item);
                    if (index == -1) {
                        // Don't allow adding negative items
                        if (count >= 0) {
                            index = drone.m_inventory.length;
                            drone.m_inventory.push(new InventoryPair(item, count));
                        }
                    }
                    else {
                        drone.m_inventory[index].m_count += count;
                    }
                    if (index != -1 && drone.m_inventory[index].m_count == 0) {
                        drone.m_inventory.splice(index, 1);
                    }
                    document.dispatchEvent(events_1.AddItemEvent(drone.m_index, item, count));
                }
                change_energy(drone, change) {
                    drone.m_energy += change;
                    document.dispatchEvent(events_1.ChangeEnergyEvent(drone.m_index, change));
                }
            };
            exports_7("DroneHelper", Dronef);
        }
    };
});
System.register("event/eventpublisher", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function EventPublisher() {
        var self = this;
        self.subscribers = [];
    }
    exports_8("EventPublisher", EventPublisher);
    function EventPublisherf() {
        var self = this;
        self.push_to_subs = function (publisher, event) {
            for (var i = 0; i < publisher.subscribers.length; ++i) {
                var subEvent = new CustomEvent(event.type, event);
                document.getElementById(publisher.subscribers[i]).dispatchEvent(subEvent);
            }
        };
        /**
         * Subscribes a DOM element to the event publisher
         * @param {String} subscriber the id of the subscribing element
         */
        self.subscribe = function (publisher, subscriber) {
            publisher.subscribers.push(subscriber);
        };
        self.register_listeners = function (publisher, events) {
            var keys = Object.keys(events);
            var length = keys.length;
            for (var i = 0; i < length; ++i) {
                document.addEventListener(events[keys[i]], (e) => {
                    self.push_to_subs(publisher, e);
                });
            }
        };
    }
    exports_8("EventPublisherf", EventPublisherf);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("game/tilegenerator", ["constants", "../util/noise.js"], function (exports_9, context_9) {
    "use strict";
    var constants_4, noise_js_1, TILES, WATER_LEVEL_RANGES, WHEAT_MIN;
    var __moduleName = context_9 && context_9.id;
    function GenerateTiles(game, width, height) {
        noise_js_1.Noise.seed(Math.random());
        let tiles = [];
        for (var i = 0; i < width; ++i) {
            tiles.push([]);
            for (var j = 0; j < height; ++j) {
                var water_level = (noise_js_1.Noise.perlin2((i + 1) / 8, (j + 1) / 8) + 1) / 2;
                for (var tl = 0; tl < WATER_LEVEL_RANGES.length; ++tl) {
                    if (water_level > WATER_LEVEL_RANGES[tl].min) {
                        tiles[i].push(WATER_LEVEL_RANGES[tl].tile);
                        break;
                    }
                }
                var crop_noise = (noise_js_1.Noise.perlin2((i + 5) / 5, (j + 5) / 5) + 1) / 2;
                if (crop_noise > WHEAT_MIN) {
                    if (tiles[i][j] == constants_4.Tiles.GRASS) {
                        tiles[i][j] = constants_4.Tiles.WHEAT_RIPE;
                    }
                }
            }
        }
        game.m_tiles = tiles;
    }
    exports_9("GenerateTiles", GenerateTiles);
    return {
        setters: [
            function (constants_4_1) {
                constants_4 = constants_4_1;
            },
            function (noise_js_1_1) {
                noise_js_1 = noise_js_1_1;
            }
        ],
        execute: function () {
            TILES = [constants_4.Tiles.GRASS, constants_4.Tiles.WATER];
            WATER_LEVEL_RANGES = [
                { tile: constants_4.Tiles.ORE_RIPE, min: 0.75 },
                { tile: constants_4.Tiles.STONE, min: 0.65 },
                { tile: constants_4.Tiles.GRASS, min: 0.35 },
                { tile: constants_4.Tiles.WATER, min: 0 }
            ];
            WHEAT_MIN = 0.65;
        }
    };
});
System.register("render/render", ["constants", "util/util", "../../node_modules/zdog/dist/zdog.dist.js", "game/game"], function (exports_10, context_10) {
    "use strict";
    var constants_5, util_3, zdog_dist_js_2, game_1, TILE_SIZE, GRASS_THRESHOLD, colorTable, BoardManager;
    var __moduleName = context_10 && context_10.id;
    function add_detail(x, y, half_board, anchor, color, stroke = 4, density = 20, height = 20, height_variation = 1, height_offset_x = 0, height_offset_z = 0, random_variation = false, optimize = true) {
        var root_pos = get_tile_pos(x, y, half_board);
        root_pos.x -= TILE_SIZE / 2;
        root_pos.z -= TILE_SIZE / 2;
        var path = [];
        for (var i = 0; i < density; ++i) {
            for (var j = 0; j < density; ++j) {
                if (optimize && !random_variation && (j > 1 && j < density - 2) && (i > 1 && i < density - 2)) {
                    continue;
                }
                var x_variation = Math.random() * 0.5 * TILE_SIZE / density;
                var z_variation = Math.random() * 0.5 * TILE_SIZE / density;
                var pos_x;
                var pos_y = -stroke / 2;
                var pos_z;
                if (random_variation) {
                    pos_x = zdog_dist_js_2.Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                    pos_z = zdog_dist_js_2.Zdog.lerp(stroke, TILE_SIZE - stroke, Math.random());
                }
                else {
                    pos_x = x_variation + zdog_dist_js_2.Zdog.lerp(0, TILE_SIZE, i / density);
                    pos_z = z_variation + zdog_dist_js_2.Zdog.lerp(0, TILE_SIZE, j / density);
                }
                path.push({
                    move: {
                        x: pos_x,
                        y: pos_y,
                        z: pos_z
                    }
                }, {
                    line: {
                        x: pos_x + height_offset_x,
                        y: pos_y + Math.random() * height_variation * height - height,
                        z: pos_z + height_offset_z
                    }
                });
            }
        }
        var grass_container = new zdog_dist_js_2.Zdog.Group({
            addTo: anchor,
            translate: { x: root_pos.x, z: root_pos.z }
        });
        var grass_shape = new zdog_dist_js_2.Zdog.Shape({
            addTo: grass_container,
            stroke: stroke,
            color: color,
            path: path
        });
        return grass_container;
    }
    function add_grass(x, y, half_board, anchor, color, density = 20, height = 20, variation = 1, optimize = true) {
        return add_detail(x, y, half_board, anchor, color, 4, density, height, variation, 0, 0, false, optimize);
    }
    function add_mineral(x, y, half_board, anchor, color, density) {
        return add_detail(x, y, half_board, anchor, color, 8, density, 0, 0, 1, 0, true);
    }
    function get_tile_pos(x, y, half_board) {
        return { x: x * TILE_SIZE - half_board, z: y * TILE_SIZE - half_board };
    }
    function semi_random_color(r, g, b, variation = 10) {
        return `rgb(${zdog_dist_js_2.Zdog.lerp(r - variation, r + variation, Math.random())}, ${zdog_dist_js_2.Zdog.lerp(g - variation, g + variation, Math.random())}, ${zdog_dist_js_2.Zdog.lerp(b - variation, b + variation, Math.random())}`;
    }
    function varied_color(color) {
        return semi_random_color(color.r, color.g, color.b, color.v);
    }
    function create_tile(color, x, y, half_board, anchor, tileType = -1, fill = true, stroke = 1) {
        var tile_surface = new zdog_dist_js_2.Zdog.Rect({
            tileType: tileType,
            addTo: anchor,
            color: color,
            width: TILE_SIZE,
            height: TILE_SIZE,
            stroke: stroke,
            fill: fill,
            translate: get_tile_pos(x, y, half_board),
            rotate: { x: zdog_dist_js_2.Zdog.TAU / 4 }
        });
        return tile_surface;
    }
    function create_drone(x, y, anchor) {
        var stroke = TILE_SIZE / 2;
        var drone_group = new zdog_dist_js_2.Zdog.Group({
            addTo: anchor
        });
        new zdog_dist_js_2.Zdog.Cone({
            addTo: drone_group,
            color: "#493a04",
            diameter: TILE_SIZE / 2,
            length: 30,
            stroke: false,
            fill: true,
            rotate: { x: zdog_dist_js_2.Zdog.TAU / 4 }
        });
        new zdog_dist_js_2.Zdog.Hemisphere({
            addTo: drone_group,
            color: "#493a04",
            diameter: TILE_SIZE / 2,
            length: 15,
            stroke: false,
            fill: true,
            rotate: { x: zdog_dist_js_2.Zdog.TAU / 4, y: zdog_dist_js_2.Zdog.TAU / 2 },
            translate: { y: -18 }
        });
        new zdog_dist_js_2.Zdog.Shape({
            addTo: drone_group,
            color: "#d8ceab",
            translate: { y: -30 },
            stroke: stroke
        });
        new zdog_dist_js_2.Zdog.Shape({
            addTo: drone_group,
            visible: false,
            translate: { y: -90 }
        });
        return drone_group;
    }
    function init_tile(game, x, y, half_board, tile, anchor) {
        return create_tile(varied_color(colorTable[tile]), x, y, half_board, anchor, tile);
    }
    function drawBoard(game, board_mgr, event) {
        var canvas = document.getElementById("cvs_viewport");
        var ctx = canvas.getContext("2d");
        var half_board = ((game.m_tiles.length - 1) * TILE_SIZE / 2);
        var full_board = game.m_tiles.length * TILE_SIZE;
        var board = new zdog_dist_js_2.Zdog.Illustration({
            element: "#cvs_viewport",
            color: "rgb(110, 210, 190)",
            resize: true,
            dragRotate: true,
            onDragStart: board_mgr.dragStart,
            onDragMove: board_mgr.dragMove,
            onDragEnd: board_mgr.dragEnd,
            rotate: { x: -zdog_dist_js_2.Zdog.TAU / 12, y: -zdog_dist_js_2.Zdog.TAU / 8 }
        });
        var root = new zdog_dist_js_2.Zdog.Group({
            addTo: board
        });
        var tiles = new zdog_dist_js_2.Zdog.Group({
            addTo: root
        });
        var grass = new zdog_dist_js_2.Zdog.Group({
            addTo: root,
            updateSort: true
        });
        var highlights = new zdog_dist_js_2.Zdog.Group({
            addTo: root
        });
        var drones = new zdog_dist_js_2.Zdog.Group({
            addTo: root,
            updateSort: true
        });
        // Keeps track of all tiles for later changes
        var tileArr = [];
        var highlightArr = [];
        var grassArr = [];
        var droneArr = [];
        for (var i = 0; i < game.m_tiles.length; ++i) {
            tileArr.push([]);
            highlightArr.push([]);
            grassArr.push([]);
            for (var j = 0; j < game.m_tiles[i].length; ++j) {
                var tile = game.m_tiles[i][j];
                var tile_surface = init_tile(game, i, j, half_board, tile, tiles);
                var tile_highlight = create_tile("rgba(255, 0, 0, 0.8)", i, j, half_board, highlights, -1, false, 4);
                tile_highlight.visible = false;
                tileArr[i].push(tile_surface);
                highlightArr[i].push(tile_highlight);
                switch (tile) {
                    case constants_5.Tiles.WHEAT_RIPE:
                        grassArr[i].push(add_grass(i, j, half_board, grass, tile_surface.color, 5, 20, 0.2, false));
                        break;
                    case constants_5.Tiles.GRASS:
                        grassArr[i].push(add_grass(i, j, half_board, grass, tile_surface.color, 8, 10));
                        break;
                    case constants_5.Tiles.ORE_RIPE:
                        grassArr[i].push(add_mineral(i, j, half_board, grass, "#930", 2));
                        break;
                    default:
                        grassArr[i].push(new zdog_dist_js_2.Zdog.Shape({ visible: false }));
                        break;
                }
            }
        }
        function draw(delta) {
            if (game.m_zoom < GRASS_THRESHOLD) {
                grass.visible = false;
            }
            else {
                grass.visible = true;
            }
            // Update drones
            var refreshed = false;
            while (droneArr.length < game.m_drones.length) {
                droneArr.push(create_drone(0, 0, grass));
                refreshed = true;
            }
            for (var i = 0; i < game.m_drones.length; ++i) {
                droneArr[i].remove();
                var x = game.m_drones[i].m_pos_x;
                var y = game.m_drones[i].m_pos_y;
                droneArr[i].translate = { x: TILE_SIZE / 2, z: TILE_SIZE / 2 };
                grassArr[x][y].addChild(droneArr[i]);
                grassArr[x][y].updateGraph();
            }
            if (refreshed) {
                grass.updateGraph();
            }
            // Update dirty tiles
            for (var i = 0; i < game.m_dirty_tiles.length; ++i) {
                var pair = game.m_dirty_tiles[i];
                tileArr[pair.x][pair.y].remove();
                tileArr[pair.x][pair.y].visible = false;
                grassArr[pair.x][pair.y].remove();
                grassArr[pair.x][pair.y].visible = false;
                tileArr[pair.x][pair.y] = init_tile(game, pair.x, pair.y, half_board, game.m_tiles[pair.x][pair.y], tiles);
                switch (game.m_tiles[pair.x][pair.y]) {
                    case constants_5.Tiles.WHEAT_RIPE:
                        grassArr[pair.x][pair.y] = add_grass(pair.x, pair.y, half_board, grass, tileArr[pair.x][pair.y].color, 5, 20, 0.2);
                        break;
                    case constants_5.Tiles.GRASS:
                        grassArr[pair.x][pair.y] = add_grass(pair.x, pair.y, half_board, grass, tileArr[pair.x][pair.y].color, 8, 10);
                        break;
                    case constants_5.Tiles.ORE_RIPE:
                        grassArr[pair.x][pair.y] = add_mineral(pair.x, pair.y, half_board, grass, "#930", 2);
                        break;
                    default:
                        grassArr[pair.x][pair.y] = new zdog_dist_js_2.Zdog.Shape({ visible: false });
                        break;
                }
                tiles.updateGraph();
                grass.updateGraph();
            }
            game.m_dirty_tiles = [];
            // Update selections
            highlightArr.map((arr) => {
                arr.map((tile) => {
                    tile.visible = false;
                });
            });
            if (board_mgr.selected_tile.x != -1 && board_mgr.selected_tile.y != -1) {
                highlightArr[board_mgr.selected_tile.x][board_mgr.selected_tile.y].visible = true;
            }
            // Do drawing
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            board.zoom = game.m_zoom;
            board.rotate.x = game.m_pitch;
            board.rotate.y = game.m_rotation;
            board.updateRenderGraph();
            //document.dispatchEvent(new event(game, delta));
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }
    exports_10("drawBoard", drawBoard);
    return {
        setters: [
            function (constants_5_1) {
                constants_5 = constants_5_1;
            },
            function (util_3_1) {
                util_3 = util_3_1;
            },
            function (zdog_dist_js_2_1) {
                zdog_dist_js_2 = zdog_dist_js_2_1;
            },
            function (game_1_1) {
                game_1 = game_1_1;
            }
        ],
        execute: function () {
            TILE_SIZE = 40;
            GRASS_THRESHOLD = 0.5;
            colorTable = util_3.createTable([constants_5.Tiles.GRASS, constants_5.Tiles.WHEAT, constants_5.Tiles.WHEAT_RIPE, constants_5.Tiles.STONE, constants_5.Tiles.ORE, constants_5.Tiles.ORE_RIPE, constants_5.Tiles.WATER], [{ r: 35, g: 135, b: 43 }, { r: 100, g: 75, b: 45 }, { r: 210, g: 155, b: 94 }, { r: 150, g: 150, b: 150, v: 5 }, { r: 80, g: 80, b: 80, v: 5 }, { r: 80, g: 80, b: 80, v: 5 }, { r: 110, g: 210, b: 190, v: 0 }]);
            BoardManager = class BoardManager {
                constructor(game) {
                    this.pitch_offset = -zdog_dist_js_2.Zdog.TAU / 12;
                    this.pitch_buf = 0;
                    this.rot_offset = -zdog_dist_js_2.Zdog.TAU / 8;
                    this.rot_buf = 0;
                    this.pitch_offset = -zdog_dist_js_2.Zdog.TAU / 12;
                    this.pitch_buf = 0;
                    this.selected_tile = new game_1.Coords(-1, -1);
                    this.game = game;
                }
                dragStart(pointer) {
                }
                dragMove(pointer, moveX, moveY) {
                    this.game.m_pitch = Math.max(-zdog_dist_js_2.Zdog.TAU / 4, Math.min(-zdog_dist_js_2.Zdog.TAU / 20, -zdog_dist_js_2.Zdog.TAU * moveY / 2000 + this.pitch_offset));
                    this.pitch_buf = this.game.m_pitch;
                    this.game.m_rotation = -zdog_dist_js_2.Zdog.TAU * moveX / 1000 + this.rot_offset;
                    this.rot_buf = this.game.m_rotation;
                }
                dragEnd() {
                    this.rot_offset = this.rot_buf;
                    this.pitch_offset = this.pitch_buf;
                }
                selectTile(x, y) {
                    this.selected_tile = new game_1.Coords(x, y);
                }
            };
            exports_10("BoardManager", BoardManager);
        }
    };
});
System.register("input/viewmodel", ["../knockout.js", "drone", "constants", "event/events"], function (exports_11, context_11) {
    "use strict";
    var knockout_js_1, drone_2, constants_6, events_2, ViewModel;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (knockout_js_1_1) {
                knockout_js_1 = knockout_js_1_1;
            },
            function (drone_2_1) {
                drone_2 = drone_2_1;
            },
            function (constants_6_1) {
                constants_6 = constants_6_1;
            },
            function (events_2_1) {
                events_2 = events_2_1;
            }
        ],
        execute: function () {
            ViewModel = class ViewModel {
                constructor(game) {
                    this.drone_helper = new drone_2.DroneHelper();
                    this.drone = knockout_js_1.ko.observable(0);
                    this.drone_name = knockout_js_1.ko.observable("Drone #");
                    this.drone_inventory = knockout_js_1.ko.observableArray();
                    this.drone_energy = knockout_js_1.ko.observable(0);
                    this.drones = knockout_js_1.ko.observableArray();
                    this.game = game;
                    this.drone.subscribe(function () {
                        this.drone_name("Drone " + this.drone());
                        this.drone_inventory.removeAll();
                        for (var i = 0; i < game.m_drones[this.drone()].m_inventory.length; ++i) {
                            this.drone_inventory.push(knockout_js_1.ko.observable(game.m_drones[this.drone()].m_inventory[i]));
                        }
                        this.drone_energy(game.m_drones[this.drone()].m_energy);
                    });
                }
                addItem(item, count = 1) {
                    this.drone_helper.add_item(this.game.m_drones[this.drone()], item, count);
                }
                ;
                addWheat(count = 1) {
                    this.addItem(constants_6.Items.WHEAT, count);
                }
                ;
                addOre(count = 1) {
                    this.addItem(constants_6.Items.ORE, count);
                }
                ;
                addDrone() {
                    var drone_index = this.game.m_drones.length;
                    this.game.add_drone();
                    this.drones.push(drone_index);
                }
                ;
                selectDrone(index) {
                    this.game.select_drone(index);
                    this.drone(index);
                    document.dispatchEvent(events_2.ChangeSelectedEvent(index));
                }
                ;
            };
            exports_11("ViewModel", ViewModel);
        }
    };
});
System.register("main", ["drone", "event/eventpublisher", "event/events", "game/game", "game/tilegenerator", "render/render", "util/util", "input/input", "./knockout.js", "constants", "input/viewmodel"], function (exports_12, context_12) {
    "use strict";
    var drone_3, eventpublisher_1, events_3, game_2, tilegenerator_1, render_1, util_4, input_1, knockout_js_2, constants_7, viewmodel_1;
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [
            function (drone_3_1) {
                drone_3 = drone_3_1;
            },
            function (eventpublisher_1_1) {
                eventpublisher_1 = eventpublisher_1_1;
            },
            function (events_3_1) {
                events_3 = events_3_1;
            },
            function (game_2_1) {
                game_2 = game_2_1;
            },
            function (tilegenerator_1_1) {
                tilegenerator_1 = tilegenerator_1_1;
            },
            function (render_1_1) {
                render_1 = render_1_1;
            },
            function (util_4_1) {
                util_4 = util_4_1;
            },
            function (input_1_1) {
                input_1 = input_1_1;
            },
            function (knockout_js_2_1) {
                knockout_js_2 = knockout_js_2_1;
            },
            function (constants_7_1) {
                constants_7 = constants_7_1;
            },
            function (viewmodel_1_1) {
                viewmodel_1 = viewmodel_1_1;
            }
        ],
        execute: function () {
            (function (/**Window */ window) {
                const document = window.document;
                const DRONE_HUNGER = 1; // Amount of food (wheat) each drone eats
                const DRONE_ENERGY_RECOVER = 50; // Amount of energy recovered from eating TODO make random
                /* Allows converting crop to the tile it's obtained from */
                const CROP_TABLE = util_4.createTable([constants_7.Items.WHEAT, constants_7.Items.ORE], [constants_7.Tiles.WHEAT_RIPE, constants_7.Tiles.ORE_RIPE]);
                const TILE_REGROW_TABLE = util_4.createTable([constants_7.Tiles.WHEAT, constants_7.Tiles.ORE], [constants_7.Tiles.WHEAT_RIPE, constants_7.Tiles.ORE_RIPE]);
                function update_ai(game, drone_helper) {
                    for (var i = 0; i < game.m_drones.length; ++i) {
                        // If the drone has no goal, we should give him one by checking his deficits
                        if (game.m_drones[i].m_goal == constants_7.Goals.NONE && game.m_drones[i].m_job) {
                            var deficit = drone_helper.get_priority_deficit(game.m_drones[i]);
                            drone_helper.set_goal_from_deficit(game.m_drones[i], game, deficit, events_3.ChangeGoalEvent);
                        }
                        var initial_goal = game.m_drones[i].m_goal;
                        perform_goal(game.m_drones[i], drone_helper, game);
                        if (initial_goal != game.m_drones[i].m_goal) {
                            document.dispatchEvent(events_3.ChangeGoalEvent(i, game.m_drones[i].m_goal));
                        }
                    }
                }
                function click_helper(document, btn_id, event, args = []) {
                    document.getElementById(btn_id).addEventListener("click", (e) => {
                        document.dispatchEvent(new event(...args));
                    });
                }
                function init_event_dispatchers(document, game) {
                    click_helper(document, "btn_adddrone", events_3.AddDroneEvent, [0, 0]);
                    click_helper(document, "btn_dotick", events_3.TickEvent);
                }
                function init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper) {
                    epublisher_helper.subscribe(epublisher, "cvs_viewport");
                    epublisher_helper.subscribe(epublisher, "console");
                    var viewport = document.getElementById("cvs_viewport");
                    window.addEventListener("resize", function (e) {
                        viewport.width = viewport.parentElement.clientWidth;
                        viewport.height = viewport.parentElement.clientHeight;
                    });
                    window.addEventListener("load", function (e) {
                        viewport.width = viewport.parentElement.clientWidth;
                        viewport.height = viewport.parentElement.clientHeight;
                    });
                    viewport.addEventListener(events_3.Events.ON_TICK, function (e) {
                        do_tick(game, drone_helper);
                        game.m_tiles[0][1] = constants_7.Tiles.GRASS;
                        game.m_dirty_tiles.push({ x: 0, y: 1 });
                    });
                    var mousewheel_handler = function (e) {
                        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                        var newZoom = game.m_zoom + delta * Math.log10(1 + game.m_zoom);
                        if (newZoom < 0.25 || !newZoom)
                            newZoom = 0.25;
                        game.m_zoom = newZoom;
                        return false;
                    };
                    viewport.addEventListener("mousewheel", mousewheel_handler);
                    viewport.addEventListener("DOMMouseScroll", mousewheel_handler);
                    viewport.addEventListener("keydown", function (e) {
                        game.m_input_mgr.m_keystates[e.keyCode] = true;
                        if (e.shiftKey) {
                            game.m_input_mgr.m_keystates["SHIFT"] = true;
                        }
                    });
                    viewport.addEventListener("keyup", function (e) {
                        game.m_input_mgr.m_keystates[e.keyCode] = false;
                        if (e.shiftKey) {
                            game.m_input_mgr.m_keystates["SHIFT"] = false;
                        }
                    });
                    document.getElementById("inventory-pane").addEventListener(events_3.Events.ADD_ITEM, function (e) {
                        // If the selected drone just got an item, update the ui
                        if (e.detail.drone === game.m_selected_drone) {
                            // clear the inventory pane
                            e.target.innerHTML = "";
                            for (var i = 0; i < game.m_drones[game.m_selected_drone].m_inventory.length; ++i) {
                                var new_element = document.createElement("div");
                                var inv_pair = game.m_drones[game.m_selected_drone].m_inventory[i];
                                new_element.innerHTML = inv_pair.m_item + ": " + inv_pair.m_count;
                                e.target.appendChild(new_element);
                            }
                        }
                    });
                    var console = document.getElementById("console");
                    console.addEventListener(events_3.Events.ADD_ITEM, function (e) {
                        log("Drone " + e.detail.drone + (e.detail.count > 0 ? " gets " : " loses ") + Math.abs(e.detail.count) + " " + constants_7.ItemStrings[e.detail.item] + ".");
                        // update viewmodel
                        viewmodel.drone.valueHasMutated();
                    });
                    console.addEventListener(events_3.Events.CHANGE_GOAL, function (e) {
                        log("Drone " + e.detail.drone + " wants to " + constants_7.GoalStrings[e.detail.goal] + ".");
                    });
                    console.addEventListener(events_3.Events.CHANGE_ENERGY, function (e) {
                        viewmodel.drone.valueHasMutated();
                    });
                    console.addEventListener(events_3.Events.CHANGE_SELECTED, function (e) {
                        board.selectTile(game.m_drones[e.detail.drone].m_pos_x, game.m_drones[e.detail.drone].m_pos_y);
                    });
                }
                function init_log() {
                    let console = document.getElementById("console");
                    console.value = "";
                }
                function log(str) {
                    var console = document.getElementById("console");
                    var date = new Date();
                    // add a newline if anything is in the console already
                    if (console.value != "") {
                        console.value += "\n";
                    }
                    var hrs = (date.getHours() + "").padStart(2, "0");
                    var mins = (date.getMinutes() + "").padStart(2, "0");
                    var secs = (date.getSeconds() + "").padStart(2, "0");
                    console.value += ("[" + hrs + ":" + mins + ":" + secs + "] " + str);
                    console.scrollTop = console.scrollHeight;
                }
                function do_tick(game, drone_helper) {
                    update_ai(game, drone_helper);
                }
                function perform_goal(drone, drone_helper, game) {
                    var drone_index = drone_helper.to_index(drone, game);
                    drone_helper.change_energy(drone, -10);
                    if (drone.m_goal == constants_7.Goals.EAT) {
                        var wheat_index = drone_helper.find_in_inventory(drone, constants_7.Items.WHEAT);
                        if (drone.m_inventory[wheat_index] && drone.m_inventory[wheat_index].m_count >= DRONE_HUNGER) {
                            drone_helper.add_item(drone, constants_7.Items.WHEAT, -DRONE_HUNGER);
                            drone_helper.change_energy(drone, DRONE_ENERGY_RECOVER);
                            drone.m_goal = constants_7.Goals.NONE;
                        }
                    }
                    else if (drone.m_goal == constants_7.Goals.HARVEST) {
                        if (game.m_tiles[drone.m_pos_x][drone.m_pos_y] == constants_7.Tiles.WHEAT) {
                            game.harvest(drone.m_pos_x, drone.m_pos_y);
                            drone_helper.add_item(drone, constants_7.Items.WHEAT, 1);
                        }
                        //TODO: pathfinding
                    }
                }
                /* Entry point */
                var drone_helper = new drone_3.DroneHelper();
                var epublisher = new eventpublisher_1.EventPublisher();
                var epublisher_helper = new eventpublisher_1.EventPublisherf();
                var input_mgr = new input_1.InputManager();
                var input_mgr_helper = new input_1.InputManagerHelper();
                var game = new game_2.GameState();
                var board = new render_1.BoardManager(game);
                var viewmodel = new viewmodel_1.ViewModel(game);
                viewmodel.addDrone();
                viewmodel.selectDrone(0);
                game.m_tiles = [
                    [constants_7.Tiles.GRASS, constants_7.Tiles.ORE, constants_7.Tiles.GRASS, constants_7.Tiles.WHEAT_RIPE],
                    [constants_7.Tiles.GRASS, constants_7.Tiles.ORE, constants_7.Tiles.ORE, constants_7.Tiles.WHEAT_RIPE],
                    [constants_7.Tiles.GRASS, constants_7.Tiles.GRASS, constants_7.Tiles.ORE, constants_7.Tiles.WHEAT_RIPE],
                    [constants_7.Tiles.WHEAT_RIPE, constants_7.Tiles.WHEAT_RIPE, constants_7.Tiles.ORE, constants_7.Tiles.WHEAT_RIPE]
                ];
                tilegenerator_1.GenerateTiles(game, 16, 16);
                var events_to_listen = events_3.Events + "load" + "mousewheel" + "DOMMouseScroll";
                epublisher_helper.register_listeners(epublisher, events_3.Events);
                init_event_dispatchers(document, game);
                init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper);
                init_log();
                knockout_js_2.ko.applyBindings(viewmodel);
                log("Done setting up!");
                render_1.drawBoard(game, board, events_3.RenderEvent);
            })(window);
        }
    };
});
