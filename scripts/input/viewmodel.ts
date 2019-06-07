import "knockout";
import { Drone, DroneHelper, InventoryPair } from "../drone";
import { Items } from "../constants";
import { GameState } from "../game/game";
import { ChangeSelectedEvent } from '../event/events';

class ViewModel
{
    drone_helper: DroneHelper;
    drone: KnockoutObservable<number>;
    drone_name: KnockoutObservable<String>;
    drone_inventory: KnockoutObservableArray<InventoryPair>;
    drone_energy: KnockoutObservable<Number>;
    drones: KnockoutObservableArray<number>;
    game: GameState;

    constructor(game: GameState)
    {
        this.drone_helper = new DroneHelper();
        this.drone = ko.observable(0);
        this.drone_name = ko.observable("Drone #");
        this.drone_inventory = ko.observableArray();
        this.drone_energy = ko.observable(0);
        this.drones = ko.observableArray(); 
        this.game = game;

        this.drone.subscribe(function()
        {
            this.drone_name("Drone " + this.drone());

            this.drone_inventory.removeAll();
            for(var i = 0; i < game.m_drones[this.drone()].m_inventory.length; ++i)
            {
                this.drone_inventory.push(ko.observable(game.m_drones[this.drone()].m_inventory[i]))
            }

            this.drone_energy(game.m_drones[this.drone()].m_energy);
        });
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
        this.game.add_drone();
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