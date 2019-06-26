import { Observable, ObservableArray } from "../knockout.js";
import { Items } from "../constants.js";
import { DroneHelper, InventoryPair } from "../drone.js";
import { ChangeSelectedEvent } from '../event/events.js';
import { GameState, SerialGameState, do_tick } from "../game/game.js";
import { loadJson, load_text, Manifest, postToServer, DTFTypes } from "../network/network.js";
import { reset_board, BoardManager } from '../render/render.js';
import copy from '../util/copy.js';
import { KnockoutStatic } from "../../node_modules/knockout/build/output/knockout-latest.js";
import { parse_JSON_as } from "../util/jsonutil.js";
import { PostActions } from '../network/network.js';
declare var ko: KnockoutStatic;

const GAMES_PATH = "games/";
const GAME_MANIFEST_PATH = GAMES_PATH + "manifest.json";
const LOCAL_STORAGE_KEY = "minisims_games";

class ViewModel
{
    droneHelper: DroneHelper;
    drone: Observable<number>;
    droneName: Observable<String>;
    droneInventory: ObservableArray<Observable<InventoryPair>>;
    droneEnergy: Observable<Number>;
    drones: ObservableArray<number>;
    games: ObservableArray<SerialGameState>;
    board: BoardManager
    game: GameState;

    constructor(game: GameState, board: BoardManager)
    {
        this.droneHelper = new DroneHelper();
        this.drone = ko.observable(0);
        this.droneName = ko.observable("Drone #");
        this.droneInventory = ko.observableArray<Observable<InventoryPair>>();
        this.droneEnergy = ko.observable(0);
        this.drones = ko.observableArray(); 
        this.games = ko.observableArray([]);
        this.board = board;
        this.game = game;

        this.drone.subscribe(() => this.updateDroneData());
    }

    private updateDroneData()
    {
        this.droneName("Drone " + this.drone());

        this.droneInventory.removeAll();
        for(var i = 0; i < this.game.drones[this.drone()].inventory.length; ++i)
        {
            this.droneInventory.push(ko.observable(this.game.drones[this.drone()].inventory[i]))
        }

        this.droneEnergy(this.game.drones[this.drone()].energy);
    }

    doTick()
    {
        do_tick(this.game, this.droneHelper);
    }

    async loadGamesFromManifest()
    {
        let man = await loadJson<Manifest>(GAME_MANIFEST_PATH);
        
        let game_arr: Promise<SerialGameState>[] = [];
        for(let i = 0; i < man.paths.length; ++i)
        {
            let game_promise = load_text(GAMES_PATH + man.paths[i]).then(function (game: string) {
                console.log("Loaded game " + man.paths[i]);
                return parse_JSON_as<SerialGameState>(game);
            });

            game_arr.push(game_promise);
        }

        return await Promise.all(game_arr).then((arr: SerialGameState[]) => { this.games(this.games().concat(arr)) } );
    }

    loadGamesFromLocalStorage()
    {
        let games = parse_JSON_as<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));
        if(games)
        {
            let new_games: SerialGameState[] = [];
            for(var i = 0; i < games.length; ++i)
            {
                new_games.push(parse_JSON_as<SerialGameState>(games[i]));
            }

            this.games(this.games().concat(new_games));
        }
    }

    saveGame()
    {
        this.games.push(parse_JSON_as<SerialGameState>(this.game.serialize()));
        postToServer(this.game.serialize(), this.game.name, DTFTypes.GAMESTATE, PostActions.SAVE_FILE, [], "application/json; charset=utf-8");
        console.log("Pushed game to server!");
    }

    saveGameToLocalStorage()
    {
        let games = parse_JSON_as<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));

        if(!games)
        {
            games = [];
        }

        games.push(this.game.serialize());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));

        this.games.push(parse_JSON_as<SerialGameState>(this.game.serialize()));
    }

    deleteGame(name: string)
    {
        let games: string[] = parse_JSON_as<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));
        let loadedGames: SerialGameState[] = this.games();

        if(games)
        {
            // Delete game from localstorage
            for(var i = 0; i < games.length; ++i)
            {
                let gameState = parse_JSON_as<SerialGameState>(games[i]);
                if(gameState.name == name)
                {
                    games.splice(i, 1);
                    break;
                }
            }

            // Delete game from loaded games
            for(var i = 0; i < loadedGames.length; ++i)
            {
                let gameState = loadedGames[i];
                if(gameState.name == name)
                {
                    loadedGames.splice(i, 1);
                    this.games(loadedGames);
                    break;
                }
            }
            
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
        }
    }

    addItem(item: Items, count: number = 1)
    {
        this.droneHelper.add_item(this.game.drones[this.drone()], item, count);
    }

    addWheat(count: number = 1)
    {
        this.addItem(Items.WHEAT, count);
    }

    addOre(count: number = 1)
    {
        this.addItem(Items.ORE, count);
    }

    addDrone()
    {
        var droneIndex = this.game.drones.length;
        this.game.add_drone(); //FIXME the drone y coordinate is undefined sometimes, why?
        this.drones.push(droneIndex);
    }

    loadGame(index: number)
    {
        console.log("Loading game '" + this.games()[index].name + "'...");
        let gameCopy = copy(this.games()[index]);
        this.game = new GameState(gameCopy.name, gameCopy);
        this.board.game = this.game;
        reset_board(this.game, this.board)
    }

    selectDrone(index: number)
    {
        this.game.select_drone(index);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    }
}

export { ViewModel };
