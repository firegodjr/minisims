import { Items } from "../constants.js";
import { DroneHelper } from "../drone.js";
import { ChangeSelectedEvent } from '../event/events.js';
var ViewModel = /** @class */ (function () {
    function ViewModel(game) {
        var _this = this;
        this.drone_helper = new DroneHelper();
        this.drone = ko.observable(0);
        this.drone_name = ko.observable("Drone #");
        this.drone_inventory = ko.observableArray();
        this.drone_energy = ko.observable(0);
        this.drones = ko.observableArray();
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
    ViewModel.prototype.selectDrone = function (index) {
        this.game.select_drone(index);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    };
    ;
    return ViewModel;
}());
export { ViewModel };
