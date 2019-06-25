import { DroneHelper } from "./drone.js";
import { EventPublisher, EventPublisherHelper } from './event/eventpublisher.js';
import { Events, AddDroneEvent, TickEvent, ChangeGoalEvent } from './event/events.js';
import { GameState, do_tick } from "./game/game.js";
import { GenerateTiles } from "./game/tilegenerator.js";
import { draw_board, BoardManager } from "./render/render.js";
import { InputManager, InputManagerHelper } from "./io/input.js";
import { KnockoutStatic } from "../node_modules/knockout/build/output/knockout-latest.js";
import { ItemStrings, GoalStrings, Tiles } from "./constants.js";
import { ViewModel } from "./io/viewmodel.js";
import { log, init_log } from "./io/output.js";
import { ModelStore } from "./render/models.js";
import { get_element } from "./util/docutil.js";
import { request_from_server } from "./network/network.js";
import { push_updates } from './network/sync.js';
import { TileUpdateDTF } from './network/dtf.js';
declare var ko: KnockoutStatic;

(function(window: Window){
    const document = window.document;

    function click_helper(document: Document, btn_id: string, event: any, args: Array<any> = [])
    {
        get_element(document, btn_id).addEventListener("click", (e) => 
        {
            document.dispatchEvent(new event(...args));
        });
    }

    function init_event_dispatchers(document: Document, game: GameState)
    {
        click_helper(document, "btn_adddrone", AddDroneEvent, [0, 0]);
        click_helper(document, "btn_dotick", TickEvent);
    }

    function init_event_listeners(document: Document, game: GameState, epublisher: EventPublisher, epublisher_helper: EventPublisherHelper, drone_helper: DroneHelper)
    {
        epublisher_helper.subscribe(epublisher, "cvs_viewport");
        epublisher_helper.subscribe(epublisher, "console");

        var viewport = get_element<HTMLCanvasElement>(document, "cvs_viewport");
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

        viewport.addEventListener(Events.ON_TICK, function(e)
        {
            game.m_dirty_tiles.push({x: 0, y: 1})
        });

        viewport.addEventListener(Events.CHANGE_TILE, function(e: CustomEvent)
        {
            let tileUpdate = new TileUpdateDTF(e.detail.x, e.detail.y, e.detail.type);
            push_updates([tileUpdate]);
        });

        var mousewheel_handler = function(e: WheelEvent)
        {
            var delta = Math.max(-1, Math.min(1, (e!.deltaY || -e.detail)));
            var newZoom = game.m_zoom + delta * Math.log10(1 + game.m_zoom);

            if(newZoom < 0.25 || !newZoom) newZoom = 0.25;

            game.m_zoom = newZoom;

            return false;
        }

        viewport.addEventListener("mousewheel", mousewheel_handler);
        viewport.addEventListener("DOMMouseScroll", mousewheel_handler);
        document.addEventListener("keydown", function(e: KeyboardEvent)
        {
            // DEBUG //
            let xhrequest = request_from_server();
            xhrequest.then((obj) => { console.log(JSON.parse(JSON.parse(obj.responseText)[0])) });

            game.m_input_mgr.m_keystates.set(e.keyCode, true)
            if(e.shiftKey)
            {
                game.m_input_mgr.m_keystates.set("SHIFT", true);
            }
        });
        document.addEventListener("keyup", function(e)
        {
            game.m_input_mgr.m_keystates.set(e.keyCode, false);
            if(e.shiftKey)
            {
                game.m_input_mgr.m_keystates.set("SHIFT", false);
            }
        });

        get_element(document, "inventory-pane").addEventListener(Events.ADD_ITEM, function(e: CustomEvent)
        {
            let target_element = e.target as HTMLElement;
            // If the selected drone just got an item, update the ui
            if(e.detail.drone === game.m_selected_drone)
            {
                // clear the inventory pane
                target_element.innerHTML = "";
                for(var i = 0; i < game.m_drones[game.m_selected_drone].m_inventory.length; ++i)
                {
                    var new_element = document.createElement("div");
                    var inv_pair = game.m_drones[game.m_selected_drone].m_inventory[i];
                    new_element.innerHTML = inv_pair.m_item + ": " + inv_pair.m_count;
                    target_element.appendChild(new_element);
                }
            }
        });

        var console_area = document.getElementById("console");

        console_area.addEventListener(Events.ADD_ITEM, function(e: CustomEvent)
        {
            log("Drone " + e.detail.drone + (e.detail.count > 0 ? " gets " : " loses ") + Math.abs(e.detail.count) + " " + ItemStrings[e.detail.item] + ".");
            // update viewmodel
            viewmodel.drone.valueHasMutated();
        });

        console_area.addEventListener(Events.CHANGE_GOAL, function(e: CustomEvent)
        {
            log("Drone " + e.detail.drone + " wants to " + GoalStrings[e.detail.goal] + ".");
        });

        console_area.addEventListener(Events.CHANGE_ENERGY, function(e: CustomEvent)
        {
            viewmodel.drone.valueHasMutated();
        });

        console_area.addEventListener(Events.CHANGE_SELECTED, function(e: CustomEvent)
        {
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
    let model_store = new ModelStore();
    viewmodel.addDrone();
    viewmodel.selectDrone(0);
    viewmodel.loadGamesFromManifest();
    viewmodel.loadGamesFromLocalStorage();
    model_store.load_models().then(() => 
    {
        GenerateTiles(game, 16, 16);

        draw_board(game, board, model_store);
        //DEBUG
        game.update_tile(0, 0, Tiles.WATER);
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