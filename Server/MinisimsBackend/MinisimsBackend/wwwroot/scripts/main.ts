import { DroneHelper } from "./drone.js";
import { EventPublisher, EventPublisherHelper } from './event/eventpublisher.js';
import { Events, AddDroneEvent, TickEvent, ChangeGoalEvent } from './event/events.js';
import { GameState, doTick } from "./game/game.js";
import { GenerateTiles } from "./game/tilegenerator.js";
import { drawBoard, BoardManager } from "./render/render.js";
import { InputManager, InputManagerHelper } from "./io/input.js";
import { KnockoutStatic } from "../node_modules/knockout/build/output/knockout-latest.js";
import { ItemStrings, GoalStrings, TileTypes } from "./constants.js";
import { ViewModel } from "./io/viewmodel.js";
import { log, initLog } from "./io/output.js";
import { ModelStore } from "./render/models.js";
import { getElement } from "./util/docutil.js";
import { requestUpdate, startRepeatUpdateRequests, requestFullState } from "./network/network.js";
import { pushUpdates } from './network/sync.js';
import { TileUpdateDTO } from './network/dto.js';
import { resetBoard } from './render/render.js';
declare var ko: KnockoutStatic;

(function(window: Window){
    const document = window.document;

    function click_helper(document: Document, btn_id: string, event: any, args: Array<any> = [])
    {
        getElement(document, btn_id).addEventListener("click", (e) => 
        {
            document.dispatchEvent(new event(...args));
        });
    }

    function initEventDispatchers(document: Document, game: GameState)
    {
        click_helper(document, "btn_adddrone", AddDroneEvent, [0, 0]);
        click_helper(document, "btn_dotick", TickEvent);
    }

    function initEventListeners(document: Document, game: GameState, epublisher: EventPublisher, epublisher_helper: EventPublisherHelper, drone_helper: DroneHelper)
    {
        epublisher_helper.subscribe(epublisher, "cvs_viewport");
        epublisher_helper.subscribe(epublisher, "console");

        var viewport = getElement<HTMLCanvasElement>(document, "cvs_viewport");
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
            game.dirtyTiles.push({x: 0, y: 1})
        });

        viewport.addEventListener(Events.CHANGE_TILE, function(e: CustomEvent)
        {
            let tileUpdate = new TileUpdateDTO(e.detail.x, e.detail.y, e.detail.type);
            pushUpdates([tileUpdate]);
        });

        var mousewheel_handler = function(e: WheelEvent)
        {
            var delta = Math.max(-1, Math.min(1, (e!.deltaY || -e.detail)));
            var newZoom = game.zoom + delta * Math.log10(1 + game.zoom);

            if(newZoom < 0.25 || !newZoom) newZoom = 0.25;

            game.zoom = newZoom;

            return false;
        }

        viewport.addEventListener("mousewheel", mousewheel_handler);
        viewport.addEventListener("DOMMouseScroll", mousewheel_handler);
        document.addEventListener("keydown", function(e: KeyboardEvent)
        {
            game.inputMgr.keystates.set(e.keyCode, true)
            if(e.shiftKey)
            {
                game.inputMgr.keystates.set("SHIFT", true);
            }

            //DEBUG
            let x = Math.floor(Math.random() * 16)
            let y = Math.floor(Math.random() * 16)
            console.log(`x: ${x}, y: ${y}`);
            game.setTile(x, y, TileTypes.STONE);
        });
        document.addEventListener("keyup", function(e)
        {
            game.inputMgr.keystates.set(e.keyCode, false);
            if(e.shiftKey)
            {
                game.inputMgr.keystates.set("SHIFT", false);
            }
        });

        getElement(document, "inventory-pane").addEventListener(Events.ADD_ITEM, function(e: CustomEvent)
        {
            let targetElement = e.target as HTMLElement;
            // If the selected drone just got an item, update the ui
            if(e.detail.drone === game.selectedDrone)
            {
                // clear the inventory pane
                targetElement.innerHTML = "";
                //for(var i = 0; i < game.drones[game.selectedDrone].inventory.length; ++i)
                //{
                //    var newElement = document.createElement("div");
                //    var invPair = game.drones[game.selectedDrone].inventory[i];
                //    newElement.innerHTML = invPair.item + ": " + invPair.count;
                //    targetElement.appendChild(newElement);
                //}
            }
        });

        var consoleArea = document.getElementById("console");

        consoleArea.addEventListener(Events.ADD_ITEM, function(e: CustomEvent)
        {
            log("Drone " + e.detail.drone + (e.detail.count > 0 ? " gets " : " loses ") + Math.abs(e.detail.count) + " " + ItemStrings[e.detail.item] + ".");
            // update viewmodel
            viewmodel.drone.valueHasMutated();
        });

        consoleArea.addEventListener(Events.CHANGE_GOAL, function(e: CustomEvent)
        {
            log("Drone " + e.detail.drone + " wants to " + GoalStrings[e.detail.goal] + ".");
        });

        consoleArea.addEventListener(Events.CHANGE_ENERGY, function(e: CustomEvent)
        {
            viewmodel.drone.valueHasMutated();
        });

        consoleArea.addEventListener(Events.CHANGE_SELECTED, function(e: CustomEvent)
        {
            board.selectTile(game.drones[e.detail.drone].posX, game.drones[e.detail.drone].posY);
        });
    }


    /* Entry point */
    var droneHelper = new DroneHelper();
    var epub = new EventPublisher();
    var epubHelper = new EventPublisherHelper();
    var inputMgr = new InputManager();
    var inputMgrHelper = new InputManagerHelper();
    var game = new GameState();
    var board = new BoardManager(game);
    var viewmodel = new ViewModel(game, board);
    let modelStore = new ModelStore();
    viewmodel.addDrone();
    viewmodel.selectDrone(0);
    viewmodel.loadGamesFromManifest();
    viewmodel.loadGamesFromLocalStorage();
    modelStore.load_models().then(() => {
        requestFullState(game).then(() => {
            startRepeatUpdateRequests(game);
            drawBoard(game, board, modelStore);
        });
    });

    
    epubHelper.registerListeners(epub);
    initEventDispatchers(document, game);
    initEventListeners(document, game, epub, epubHelper, droneHelper);
    initLog();

    ko.applyBindings(viewmodel);
    log("Done setting up!");
})(window);