import { Drone, Dronef } from "./drone.js";
import {EventPublisher, EventPublisherf} from "./event/eventpublisher.js";
import { Goals, GoalStrings, Tiles, TileStrings, Items, ItemStrings, Deficits } from "./constants.js";
import { Events, AddDroneEvent, AddItemEvent, TickEvent, ChangeEnergyEvent, ChangeSelectedEvent, ChangeGoalEvent, RenderEvent } from "./event/events.js";
import {GameState} from "./game/game.js";
import {GenerateTiles} from "./game/tilegenerator.js";
import {drawBoard} from "./render/render.js";
import {createTable} from "./util/util.js";
import { InputManager, InputManagerf } from "./input/input.js";


(function(/**Window */window){
    const document = window.document;


    const DRONE_HUNGER = 1; // Amount of food (wheat) each drone eats
    const DRONE_ENERGY_RECOVER = 50; // Amount of energy recovered from eating TODO make random

    /* Allows converting crop to the tile it's obtained from */
    const CROP_TABLE = createTable(
        [Items.WHEAT, Items.ORE], 
        [Tiles.WHEAT_RIPE, Tiles.ORE_RIPE]
    );

    const TILE_DEGRADE_TABLE = createTable(
        [Tiles.WHEAT_RIPE, Tiles.ORE_RIPE],
        [Tiles.WHEAT, Tiles.ORE]
    );

    const TILE_REGROW_TABLE = createTable(
        [Tiles.WHEAT, Tiles.ORE],
        [Tiles.WHEAT_RIPE, Tiles.ORE_RIPE]
    );

    function createFarmerGoalTable()
    {
        return createTable(
            [Deficits.ENERGY, Deficits.LOW_CROP, Deficits.ENOUGH_CROP],
            [Goals.EAT, Goals.HARVEST, Goals.GIVE_ITEM]
        );
    }

    function goalHarvestTile(tile)
    {
        var self = this;
        self.m_tile = tile;

        return self;
    }

    function update_ai(game, drone_helper)
    {
        for(var i = 0; i < game.m_drones.length; ++i)
        {
            // If the drone has no goal, we should give him one by checking his deficits
            if(game.m_drones[i].m_goal == Goals.NONE && game.m_drones[i].m_job)
            {
                var deficit = drone_helper.get_priority_deficit(game.m_drones[i]);
                drone_helper.set_goal_from_deficit(game.m_drones[i], game, deficit, 
                    ChangeGoalEvent);
            }

            var initial_goal = game.m_drones[i].m_goal;
            perform_goal(game.m_drones[i], drone_helper, game);
            if(initial_goal != game.m_drones[i].m_goal)
            {
                document.dispatchEvent(ChangeGoalEvent(i, game.m_drones[i].m_goal));
            }
        }
    }

    function click_helper(document, btn_id, event, args = [])
    {
        document.getElementById(btn_id).addEventListener("click", (e) => {
            document.dispatchEvent(new event(...args));
        });
    }

    function init_event_dispatchers(document, game)
    {
        click_helper(document, "btn_adddrone", AddDroneEvent, [0, 0]);

        click_helper(document, "btn_addwheat", AddItemEvent, [game.m_selected_drone, Items.WHEAT, 1]);
        click_helper(document, "btn_delwheat", AddItemEvent, [game.m_selected_drone, Items.WHEAT, -1]);
        click_helper(document, "btn_addore", AddItemEvent, [game.m_selected_drone, Items.ORE, 1]);
        click_helper(document, "btn_delore", AddItemEvent, [game.m_selected_drone, Items.ORE, -1]);

        click_helper(document, "btn_dotick", TickEvent);
    }

    function init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper)
    {
        epublisher_helper.subscribe(epublisher, "cvs_viewport");
        epublisher_helper.subscribe(epublisher, "inventory-pane");
        epublisher_helper.subscribe(epublisher, "lbl_dronename");
        epublisher_helper.subscribe(epublisher, "prgbar_energy");
        epublisher_helper.subscribe(epublisher, "console");

        var viewport = document.getElementById("cvs_viewport");
        window.addEventListener("resize", function(e)
        {
            viewport.width = viewport.parentElement.clientWidth;
            viewport.height = viewport.parentElement.clientHeight;
        });

        window.addEventListener("load", function(e)
        {
            viewport.width = viewport.parentElement.clientWidth;
            viewport.height = viewport.parentElement.clientHeight;
        });

        viewport.addEventListener(Events.ADD_ITEM, function(e)
        {
            drone_helper.add_item(game.m_drones[e.detail.drone], e.detail.item, e.detail.count);
        });

        viewport.addEventListener(Events.ON_TICK, function(e)
        {
            do_tick(game, drone_helper);

            game.m_tiles[0][1] = Tiles.GRASS;
            game.m_dirty_tiles.push({x: 0, y: 1})
        });

        viewport.addEventListener(Events.CHANGE_SELECTED, function(e)
        {
            game.m_selected_drone = e.detail.drone;
        });

        viewport.addEventListener(Events.CHANGE_ENERGY, function(e)
        {
            game.m_drones[e.detail.drone].m_energy += e.detail.amount;
        });

        var mousewheel_handler = function(e)
        {
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            var newZoom = game.m_zoom + delta * Math.log10(1 + game.m_zoom);

            if(newZoom < 0.25 || !newZoom) newZoom = 0.25;

            game.m_zoom = newZoom;

            return false;
        }

        viewport.addEventListener("mousewheel", mousewheel_handler);
        viewport.addEventListener("DOMMouseScroll", mousewheel_handler);
        viewport.addEventListener("keydown", function(e)
        {
            game.m_input_mgr.m_keystates[e.keyCode] = true;
            if(e.shiftKey)
            {
                game.m_input_mgr.m_keystates["SHIFT"] = true;
            }
        });
        viewport.addEventListener("keyup", function(e)
        {
            game.m_input_mgr.m_keystates[e.keyCode] = false;
            if(e.shiftKey)
            {
                game.m_input_mgr.m_keystates["SHIFT"] = false;
            }
        });

        document.getElementById("inventory-pane").addEventListener(Events.ADD_ITEM, function(e)
        {
            // If the selected drone just got an item, update the ui
            if(e.detail.drone === game.m_selected_drone)
            {
                // clear the inventory pane
                e.target.innerHTML = "";
                for(var i = 0; i < game.m_drones[game.m_selected_drone].m_inventory.length; ++i)
                {
                    var new_element = document.createElement("div");
                    var inv_pair = game.m_drones[game.m_selected_drone].m_inventory[i];
                    new_element.innerHTML = inv_pair.m_item + ": " + inv_pair.m_count;
                    e.target.appendChild(new_element);
                }
            }
        });

        var energyBarChange = function(e)
        {
            e.target.value = game.m_drones[game.m_selected_drone].m_energy;
        }
        var energyBar = document.getElementById("prgbar_energy");
        energyBar.addEventListener(Events.CHANGE_ENERGY, energyBarChange);
        energyBar.addEventListener(Events.CHANGE_SELECTED, energyBarChange);
        energyBar.addEventListener(Events.ON_TICK, energyBarChange);

        var console = document.getElementById("console");

        console.addEventListener(Events.ADD_ITEM, function(e)
        {
            log("Drone " + e.detail.drone + (e.detail.count > 0 ? " gets " : " loses ") + Math.abs(e.detail.count) + " " + ItemStrings[e.detail.item] + ".");
        });

        console.addEventListener(Events.CHANGE_GOAL, function(e)
        {
            log("Drone " + e.detail.drone + " wants to " + GoalStrings[e.detail.goal] + ".");
        });

        var name_label = document.getElementById("lbl_dronename");

        name_label.addEventListener(Events.CHANGE_SELECTED, function(e)
        {
            name_label.innerHTML = "Drone " + e.detail.drone;
        });
    }

    function init_log()
    {
        document.getElementById("console").value = "";
    }

    function log(str)
    {
        var console = document.getElementById("console");
        var date = new Date();

        // add a newline if anything is in the console already
        if(console.value != "")
        {
            console.value += "\n";
        }

        var hrs = (date.getHours()+"").padStart(2, "0");
        var mins = (date.getMinutes()+"").padStart(2, "0");
        var secs = (date.getSeconds()+"").padStart(2, "0");

        console.value += ("[" + hrs + ":" + mins + ":" + secs + "] " + str);
        console.scrollTop = console.scrollHeight;
    }

    function do_tick(game, drone_helper)
    {
        update_ai(game, drone_helper);
    }

    function perform_goal(drone, drone_helper, game)
    {
        var drone_index = drone_helper.to_index(drone, game);
        document.dispatchEvent(ChangeEnergyEvent(drone_index, -10));

        if(drone.m_goal == Goals.EAT)
        {
            var wheat_index = drone_helper.find_in_inventory(drone, Items.WHEAT);
            if(drone.m_inventory[wheat_index] && drone.m_inventory[wheat_index].m_count >= DRONE_HUNGER)
            {
                document.dispatchEvent(AddItemEvent(drone_index, Items.WHEAT, -DRONE_HUNGER));
                document.dispatchEvent(ChangeEnergyEvent(drone_index, DRONE_ENERGY_RECOVER));
                drone.m_goal = Goals.NONE;
            }
        }
        else if(drone.m_goal == Goals.HARVEST)
        {
            //TODO: pathfinding
        }
    }

    /* Entry point */
    var drone_helper = new Dronef();
    var epublisher = new EventPublisher();
    var epublisher_helper = new EventPublisherf();
    var input_mgr = new InputManager();
    var input_mgr_helper = new InputManagerf();
    var game = new GameState();

    game.m_tiles = [
        [Tiles.GRASS, Tiles.ORE, Tiles.GRASS, Tiles.WHEAT_RIPE],
        [Tiles.GRASS, Tiles.ORE, Tiles.ORE, Tiles.WHEAT_RIPE],
        [Tiles.GRASS, Tiles.GRASS, Tiles.ORE, Tiles.WHEAT_RIPE],
        [Tiles.WHEAT_RIPE, Tiles.WHEAT_RIPE, Tiles.ORE, Tiles.WHEAT_RIPE]
    ]

    GenerateTiles(game, 16, 16);

    var events_to_listen = Events + "load" + "mousewheel" + "DOMMouseScroll";
    epublisher_helper.register_listeners(epublisher, Events);
    init_event_dispatchers(document, game);
    init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper);
    init_log();

    document.dispatchEvent(new ChangeSelectedEvent(0));
    log("Done setting up!");

    drawBoard(game, RenderEvent);
})(window);