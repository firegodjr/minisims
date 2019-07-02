import { Observable, ObservableArray } from "../knockout.js";
import { Items } from "../constants.js";
import { DroneHelper, InventoryPair, StatTypes } from "../drone.js";
import { ChangeSelectedEvent } from '../event/events.js';
import { GameState, GameStateDTO, doTick } from "../game/game.js";
import { loadJson, loadText, Manifest, postToServer, DTOTypes } from "../network/network.js";
import { resetBoard, BoardManager } from '../render/render.js';
import copy from '../util/copy.js';
import { KnockoutStatic } from "../../node_modules/knockout/build/output/knockout-latest.js";
import { parseJsonAs } from "../util/jsonutil.js";
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
    gameStates: ObservableArray<GameStateDTO>;
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
        this.gameStates = ko.observableArray([]);
        this.board = board;
        this.game = game;

        this.drone.subscribe(() => this.updateDroneData());
    }

    private updateDroneData()
    {
        this.droneName("Drone " + this.drone());

        //this.droneInventory.removeAll();
        //for(var i = 0; i < this.game.drones[this.drone()].inventory.length; ++i)
        //{
        //    this.droneInventory.push(ko.observable(this.game.drones[this.drone()].inventory[i]))
        //}

        //this.droneEnergy(this.game.drones[this.drone()].energy);
    }

    doTick()
    {
        doTick(this.game, this.droneHelper);
    }

    async loadGamesFromManifest()
    {
        let man = await loadJson<Manifest>(GAME_MANIFEST_PATH);
        
        let gameStates: Promise<GameStateDTO>[] = [];
        for(let i = 0; i < man.paths.length; ++i)
        {
            let gameStatePromise = loadText(GAMES_PATH + man.paths[i]).then(function (game: string) {
                console.log("Loaded game " + man.paths[i]);
                return parseJsonAs<GameStateDTO>(game);
            });

            gameStates.push(gameStatePromise);
        }

        return await Promise.all(gameStates).then((arr: GameStateDTO[]) => { this.gameStates(this.gameStates().concat(arr)) } );
    }

    loadGamesFromLocalStorage()
    {
        let games = parseJsonAs<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));
        if(games)
        {
            let gameState: GameStateDTO[] = [];
            for(var i = 0; i < games.length; ++i)
            {
                gameState.push(parseJsonAs<GameStateDTO>(games[i]));
            }

            this.gameStates(this.gameStates().concat(gameState));
        }
    }

    saveGame()
    {
        this.gameStates.push(parseJsonAs<GameStateDTO>(this.game.serialize()));
        postToServer(this.game.serialize(), this.game.name, DTOTypes.GAMESTATE, PostActions.SAVE_FILE, [], "application/json; charset=utf-8");
        console.log("Pushed game to server!");
    }

    saveGameToLocalStorage()
    {
        let games = parseJsonAs<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));

        if(!games)
        {
            games = [];
        }

        games.push(this.game.serialize());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));

        this.gameStates.push(parseJsonAs<GameStateDTO>(this.game.serialize()));
    }

    deleteGame(name: string)
    {
        let games: string[] = parseJsonAs<string[]>(localStorage.getItem(LOCAL_STORAGE_KEY));
        let loadedGames: GameStateDTO[] = this.gameStates();

        if(games)
        {
            // Delete game from localstorage
            for(var i = 0; i < games.length; ++i)
            {
                let gameState = parseJsonAs<GameStateDTO>(games[i]);
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
                    this.gameStates(loadedGames);
                    break;
                }
            }
            
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
        }
    }

    addItem(item: StatTypes, count: number = 1)
    {
        this.droneHelper.addItem(this.game.drones[this.drone()], item, count);
    }

    addWheat(count: number = 1)
    {
        this.addItem(StatTypes.WHEAT, count);
    }

    addOre(count: number = 1)
    {
        this.addItem(StatTypes.ORE, count);
    }

    addDrone()
    {
        var droneIndex = this.game.drones.length;
        this.game.addDrone(); //FIXME the drone y coordinate is undefined sometimes, why?
        this.drones.push(droneIndex);
    }

    loadGame(index: number)
    {
        console.log("Loading game '" + this.gameStates()[index].name + "'...");
        let gameCopy = copy(this.gameStates()[index]);
        this.game = new GameState(gameCopy.name, gameCopy);
        this.board.game = this.game;
        resetBoard(this.game, this.board)
    }

    selectDrone(index: number)
    {
        this.game.selectDrone(index);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    }
}

export { ViewModel };
