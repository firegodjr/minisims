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
import { Table } from "../util/table.js";
import { load_json } from "../network.js";
var MODELS_PATH = "models/";
var MANIFEST_PATH = MODELS_PATH + "manifest.json";
var Models;
(function (Models) {
    Models["DRONE"] = "drone";
})(Models || (Models = {}));
var ModelStore = /** @class */ (function () {
    function ModelStore() {
        this.models = new Table([]);
    }
    /**
     * Loads specified zdog models into memory. If none specified, loads all in manifest.
     */
    ModelStore.prototype.load_models = function (names) {
        return __awaiter(this, void 0, void 0, function () {
            var man, model_arr, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, load_json(MANIFEST_PATH)];
                    case 1:
                        man = _a.sent();
                        model_arr = [];
                        _loop_1 = function (i) {
                            if ((names && names.includes(man.paths[i])) || !names) {
                                model_arr.push(load_json(MODELS_PATH + man.paths[i]).then(function (model) {
                                    console.log("Loaded model " + man.paths[i]);
                                    this.models.add(model.name, json_to_zdog(model));
                                }.bind(this_1)));
                            }
                        };
                        this_1 = this;
                        for (i = 0; i < man.paths.length; ++i) {
                            _loop_1(i);
                        }
                        return [4 /*yield*/, Promise.all(model_arr)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ModelStore.prototype.get = function (name, options) {
        if (options === void 0) { options = {}; }
        return this.models.get(name).copyGraph(options);
    };
    return ModelStore;
}());
function anchor_from_key(key, params) {
    var anchor = new Zdog[key](params);
    anchor.rotate.x *= Zdog.TAU / 360;
    anchor.rotate.y *= Zdog.TAU / 360;
    anchor.rotate.z *= Zdog.TAU / 360;
    return anchor;
}
function json_to_zdog(obj, root_key) {
    if (root_key === void 0) { root_key = "Group"; }
    var children = [];
    var params = {};
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === "object" && key != "translate" && key != "rotate" && key != "scale") {
            children.push(json_to_zdog(obj[key], key));
        }
        else if (key != "name") {
            params[key] = obj[key];
        }
    });
    if (Object.keys(params).includes("type")) {
        root_key = params["type"];
    }
    var anchor = anchor_from_key(root_key, params);
    children.forEach(function (child) { return anchor.addChild(child); });
    return anchor;
}
export { ModelStore, json_to_zdog };
