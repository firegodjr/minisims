import { DroneHelper } from "./drone.js";
import { EventPublisher, EventPublisherHelper } from './event/eventpublisher.js';
import { Events, AddDroneEvent, TickEvent, ChangeGoalEvent } from './event/events.js';
import { GameState } from "./game/game.js";
import { GenerateTiles } from "./game/tilegenerator.js";
import { drawBoard, BoardManager } from "./render/render.js";
import { Table } from "./util/util.js";
import { InputManager, InputManagerHelper } from "./input/input.js";
import { Tiles, Items, Goals, ItemStrings, GoalStrings } from "./constants.js";
import { ViewModel } from "./input/viewmodel.js";
(function (/**Window */ window) {
    var document = window.document;
    var DRONE_HUNGER = 1; // Amount of food (wheat) each drone eats
    var DRONE_ENERGY_RECOVER = 50; // Amount of energy recovered from eating TODO make random
    /* Allows converting crop to the tile it's obtained from */
    var CROP_TABLE = new Table([
        { key: Items.WHEAT, value: Tiles.WHEAT_RIPE },
        { key: Items.ORE, value: Tiles.ORE_RIPE }
    ]);
    var TILE_REGROW_TABLE = new Table([
        { key: Tiles.WHEAT, value: Tiles.WHEAT_RIPE },
        { key: Tiles.ORE, value: Tiles.ORE_RIPE }
    ]);
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
    function click_helper(document, btn_id, event, args) {
        if (args === void 0) { args = []; }
        document.getElementById(btn_id).addEventListener("click", function (e) {
            document.dispatchEvent(new (event.bind.apply(event, [void 0].concat(args)))());
        });
    }
    function init_event_dispatchers(document, game) {
        click_helper(document, "btn_adddrone", AddDroneEvent, [0, 0]);
        click_helper(document, "btn_dotick", TickEvent);
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
        viewport.addEventListener(Events.ON_TICK, function (e) {
            do_tick(game, drone_helper);
            game.m_tiles[0][1] = Tiles.GRASS;
            game.m_dirty_tiles.push({ x: 0, y: 1 });
        });
        var mousewheel_handler = function (e) {
            var delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
            var newZoom = game.m_zoom + delta * Math.log10(1 + game.m_zoom);
            if (newZoom < 0.25 || !newZoom)
                newZoom = 0.25;
            game.m_zoom = newZoom;
            return false;
        };
        viewport.addEventListener("mousewheel", mousewheel_handler);
        viewport.addEventListener("DOMMouseScroll", mousewheel_handler);
        viewport.addEventListener("keydown", function (e) {
            game.m_input_mgr.m_keystates.set(e.keyCode, true);
            if (e.shiftKey) {
                game.m_input_mgr.m_keystates.set("SHIFT", true);
            }
        });
        viewport.addEventListener("keyup", function (e) {
            game.m_input_mgr.m_keystates.set(e.keyCode, false);
            if (e.shiftKey) {
                game.m_input_mgr.m_keystates.set("SHIFT", false);
            }
        });
        document.getElementById("inventory-pane").addEventListener(Events.ADD_ITEM, function (e) {
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
        console.addEventListener(Events.ADD_ITEM, function (e) {
            log("Drone " + e.detail.drone + (e.detail.count > 0 ? " gets " : " loses ") + Math.abs(e.detail.count) + " " + ItemStrings[e.detail.item] + ".");
            // update viewmodel
            viewmodel.drone.valueHasMutated();
        });
        console.addEventListener(Events.CHANGE_GOAL, function (e) {
            log("Drone " + e.detail.drone + " wants to " + GoalStrings[e.detail.goal] + ".");
        });
        console.addEventListener(Events.CHANGE_ENERGY, function (e) {
            viewmodel.drone.valueHasMutated();
        });
        console.addEventListener(Events.CHANGE_SELECTED, function (e) {
            board.selectTile(game.m_drones[e.detail.drone].m_pos_x, game.m_drones[e.detail.drone].m_pos_y);
        });
    }
    function init_log() {
        var console = document.getElementById("console");
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
        if (drone.m_goal == Goals.EAT) {
            var wheat_index = drone_helper.find_in_inventory(drone, Items.WHEAT);
            if (drone.m_inventory[wheat_index] && drone.m_inventory[wheat_index].m_count >= DRONE_HUNGER) {
                drone_helper.add_item(drone, Items.WHEAT, -DRONE_HUNGER);
                drone_helper.change_energy(drone, DRONE_ENERGY_RECOVER);
                drone.m_goal = Goals.NONE;
            }
        }
        else if (drone.m_goal == Goals.HARVEST) {
            if (game.m_tiles[drone.m_pos_x][drone.m_pos_y] == Tiles.WHEAT) {
                game.harvest(drone.m_pos_x, drone.m_pos_y);
                drone_helper.add_item(drone, Items.WHEAT, 1);
            }
            //TODO: pathfinding
        }
    }
    /* Entry point */
    var drone_helper = new DroneHelper();
    var epublisher = new EventPublisher();
    var epublisher_helper = new EventPublisherHelper();
    var input_mgr = new InputManager();
    var input_mgr_helper = new InputManagerHelper();
    var game = new GameState();
    var board = new BoardManager(game);
    var viewmodel = new ViewModel(game);
    viewmodel.addDrone();
    viewmodel.selectDrone(0);
    game.m_tiles = [
        [Tiles.GRASS, Tiles.ORE, Tiles.GRASS, Tiles.WHEAT_RIPE],
        [Tiles.GRASS, Tiles.ORE, Tiles.ORE, Tiles.WHEAT_RIPE],
        [Tiles.GRASS, Tiles.GRASS, Tiles.ORE, Tiles.WHEAT_RIPE],
        [Tiles.WHEAT_RIPE, Tiles.WHEAT_RIPE, Tiles.ORE, Tiles.WHEAT_RIPE]
    ];
    GenerateTiles(game, 16, 16);
    var events_to_listen = Events + "load" + "mousewheel" + "DOMMouseScroll";
    epublisher_helper.register_listeners(epublisher);
    init_event_dispatchers(document, game);
    init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper);
    init_log();
    ko.applyBindings(viewmodel);
    log("Done setting up!");
    drawBoard(game, board);
})(window);
