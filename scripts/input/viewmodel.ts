import { Drone, DroneHelper, InventoryPair } from "../drone.js";
import { Items } from "../constants.js";
import { GameState } from "../game/game.js";
import { ChangeSelectedEvent } from '../event/events.js';
import { ObservableArray, Observable, KnockoutStatic } from "../../node_modules/knockout/build/output/knockout-latest.js";
declare var ko: KnockoutStatic;

class ViewModel
{
    drone_helper: DroneHelper;
    drone: Observable<number>;
    drone_name: Observable<String>;
    drone_inventory: ObservableArray<Observable<InventoryPair>>;
    drone_energy: Observable<Number>;
    drones: ObservableArray<number>;
    game: GameState;

    constructor(game: GameState)
    {
        this.drone_helper = new DroneHelper();
        this.drone = ko.observable(0);
        this.drone_name = ko.observable("Drone #");
        this.drone_inventory = ko.observableArray<Observable<InventoryPair>>();
        this.drone_energy = ko.observable(0);
        this.drones = ko.observableArray(); 
        this.game = game;

        this.drone.subscribe(() => this.updateDroneData());
    }

    private updateDroneData()
    {
        this.drone_name("Drone " + this.drone());

        this.drone_inventory.removeAll();
        for(var i = 0; i < this.game.m_drones[this.drone()].m_inventory.length; ++i)
        {
            this.drone_inventory.push(ko.observable(this.game.m_drones[this.drone()].m_inventory[i]))
        }

        this.drone_energy(this.game.m_drones[this.drone()].m_energy);
    }

    addItem(item: Items, count: number = 1)
    {
        this.drone_helper.add_item(this.game.m_drones[this.drone()], item, count);
    };

    addWheat(count: number = 1)
    {
        this.addItem(Items.WHEAT, count);
    };

    addOre(count: number = 1)
    {
        this.addItem(Items.ORE, count);
    };

    addDrone()
    {
        var drone_index = this.game.m_drones.length;
        this.game.add_drone(); //FIXME the drone y coordinate is undefined sometimes, why?
        this.drones.push(drone_index);
    };

    selectDrone(index: number)
    {
        this.game.select_drone(index);
        this.drone(index);
        document.dispatchEvent(ChangeSelectedEvent(index));
    };
}

export { ViewModel };