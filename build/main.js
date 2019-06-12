import { DroneHelper } from "./drone.js";
import { EventPublisher, EventPublisherHelper } from './event/eventpublisher.js';
import { Events, AddDroneEvent, TickEvent } from './event/events.js';
import { GameState, do_tick } from "./game/game.js";
import { GenerateTiles } from "./game/tilegenerator.js";
import { draw_board, BoardManager } from "./render/render.js";
import { InputManager, InputManagerHelper } from "./io/input.js";
import { ItemStrings, GoalStrings } from "./constants.js";
import { ViewModel } from "./io/viewmodel.js";
import { log, init_log } from "./io/output.js";
import { ModelStore } from "./render/models.js";
(function (window) {
    var document = window.document;
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
    /* Entry point */
    var drone_helper = new DroneHelper();
    var epublisher = new EventPublisher();
    var epublisher_helper = new EventPublisherHelper();
    var input_mgr = new InputManager();
    var input_mgr_helper = new InputManagerHelper();
    var game = new GameState();
    var board = new BoardManager(game);
    var viewmodel = new ViewModel(game, board);
    var model_store = new ModelStore();
    viewmodel.addDrone();
    viewmodel.selectDrone(0);
    viewmodel.loadGamesFromManifest();
    viewmodel.loadGamesFromLocalStorage();
    model_store.load_models().then(function () {
        GenerateTiles(game, 16, 16);
        draw_board(game, board, model_store);
    });
    var events_to_listen = Events + "load" + "mousewheel" + "DOMMouseScroll";
    epublisher_helper.register_listeners(epublisher);
    init_event_dispatchers(document, game);
    init_event_listeners(document, game, epublisher, epublisher_helper, drone_helper);
    init_log();
    ko.applyBindings(viewmodel);
    log("Done setting up!");
    console.log(game.serialize());
})(window);
