var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Items } from "../constants.js";
import { DroneHelper } from "../drone.js";
import { ChangeSelectedEvent } from '../event/events.js';
import { GameState } from "../game/game.js";
import { load_text, load_json } from "../network.js";
import { reset_board } from '../render/render.js';
import copy from '../util/copy.js';
var GAMES_PATH = "games/";
var GAME_MANIFEST_PATH = GAMES_PATH + "manifest.json";
var LOCAL_STORAGE_KEY = "minisims_games";
var ViewModel = /** @class */ (function () {
    function ViewModel(game, board) {
        var _this = this;
        this.drone_helper = new DroneHelper();
        this.drone = ko.observable(0);
        this.drone_name = ko.observable("Drone #");
        this.drone_inventory = ko.observableArray();
        this.drone_energy = ko.observable(0);
        this.drones = ko.observableArray();
        this.games = ko.observableArray([]);
        this.board = board;
        this.game = game;
        this.drone.subscribe(function () { return _this.updateDroneData(); });
    }
    ViewModel.prototype.updateDroneData = function () {
        this.drone_name("Drone " + this.drone());
        this.drone_inventory.removeAll();
        for (var i = 0; i < this.game.m_drones[this.drone()].m_inventory.length; ++i) {
            this.drone_inventory.push(ko.observable(this.game.m_drones[this.drone()].m_inventory[i]));
        }
        this.drone_energy(this.game.m_drones[this.drone()].m_energy);
    };
    ViewModel.prototype.loadGamesFromManifest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var man, game_arr, _loop_1, this_1, i;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load_json(GAME_MANIFEST_PATH)];
                    case 1:
                        man = _a.sent();
                        game_arr = [];
                        _loop_1 = function (i) {
                            game_arr.push(load_text(GAMES_PATH + man.paths[i]).then(function (game) {
                                console.log("Loaded game " + man.paths[i]);
                                return JSON.parse(game);
                            }.bind(this_1)));
                        };
                        this_1 = this;
                        for (i = 0; i < man.paths.length; ++i) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, Promise.all(game_arr).then(function (arr) { _this.games(_this.games().concat(arr)); })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewModel.prototype.saveGame = function () {
        var games = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (!games) {
            games = [];
        }
        games.push(this.game.serialize());
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(games));
        this.games.push(JSON.parse(this.game.serialize()));
    };
    ViewModel.prototype.loadGamesFromLocalStorage = function () {
        var games = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (games) {
            var new_games = [];
            for (var i = 0; i < games.length; ++i) {
                new_games.push(JSON.parse(games[i]));
            }
            this.games(this.games().concat(new_games));
        }
    };
    ViewModel.prototype.addItem = function (item, count) {
        if (count === void 0) { count = 1; }
        this.drone_helper.add_item(this.game.m_drones[this.drone()], item, count);
    };
    ;
    ViewModel.prototype.addWheat = function (count) {
        if (count === void 0) { count = 1; }
        this.addItem(Items.WHEAT, count);
    };
    ;
    ViewModel.prototype.addOre = function (count) {
        if (count === void 0) { count = 1; }
        this.addItem(Items.ORE, count);
    };
    ;
    ViewModel.prototype.addDrone = function () {
        var drone_index = this.game.m_drones.length;
        this.game.add_drone(); //FIXME the drone y coordinate is undefined sometimes, why?
        this.drones.push(drone_index);
    };
    ;
    ViewModel.prototype.loadGame = function (index) {
        console.log("Loading game '" + this.games()[index].m_name + "'...");
        var game_copy = copy(this.games()[index]);
        this.game = new GameState(game_copy.m_name, game_copy);
        this.board.game = this.game;
        reset_board(this.game, this.board);
    };
    ViewModel.prototype.selectDrone = function (index) {
        this.game.select_drone(index);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    };
    ;
    return ViewModel;
}());
export { ViewModel };
