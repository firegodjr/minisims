import { KnockoutStatic } from '../../node_modules/knockout/build/output/knockout-latest.js';
import { DroneHelper, InventoryPair, StatTypes } from '../drone.js';
import { ChangeSelectedEvent } from '../event/events.js';
import { GameState, GameStateDTO } from '../game/game.js';
import { Observable, ObservableArray } from '../knockout.js';
import {
    DTOTypes,
    loadJson,
    loadText,
    Manifest,
    PostActions,
    postToServer,
    requestTick,
    requestUpdates,
} from '../network/network.js';
import { BoardManager, resetBoard } from '../render/render.js';
import copy from '../util/copy.js';
import { parseJsonAs } from '../util/jsonutil.js';
import { DroneUpdateDTO, TileUpdateDTO } from '../network/dto.js';
import { log } from './output.js';

declare var ko: KnockoutStatic;

const GAMES_PATH = "games/";
const GAME_MANIFEST_PATH = GAMES_PATH + "manifest.json";
const LOCAL_STORAGE_KEY = "minisims_games";

class ViewModel
{
    droneHelper: DroneHelper;
    drone: Observable<string>;
    droneName: Observable<string>;
    droneInventory: ObservableArray<Observable<InventoryPair>>;
    droneEnergy: Observable<number>;
    drones: ObservableArray<string>;
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

    updateDroneData()
    {
        this.droneName("Drone " + this.drone());

        this.droneEnergy(this.game.drones.get(this.drone()).stats.get(StatTypes.ENERGY));
        log(this.drone() + " has energy " + this.droneEnergy());
    }

    doTick()
    {
        requestTick();
        requestUpdates();
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

    addDrone()
    {
        
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

    updateDrone(update: DroneUpdateDTO)
    {
        this.game.updateDrone(update);
        if(!this.drones().includes(update.name))
        {
            this.drones.push(update.name);
        }

        if(this.drone() == update.name)
        {
            this.selectDrone(this.drone());
            this.updateDroneData();
        }
    }

    updateTile(update: TileUpdateDTO)
    {
        this.game.updateTile(update.x, update.y, update.type);
    }

    loadGame(index: number)
    {
        console.log("Loading game '" + this.gameStates()[index].name + "'...");
        let gameCopy = copy(this.gameStates()[index]);
        this.game = new GameState(gameCopy.name, gameCopy);
        this.board.game = this.game;
        resetBoard(this.game, this.board)
    }

    selectDrone(index: string)
    {
        this.game.selectDrone(index);
        let drone = this.game.drones.get(index);
        this.board.selectTile(drone.posX, drone.posY);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    }
}

export { ViewModel };
