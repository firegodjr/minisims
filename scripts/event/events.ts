import { Drone } from "../drone";
import { Items, Goals } from "../constants";
import { GameState } from "../game/game";

export enum Events
{
    ADD_DRONE = "adddrone",
    ADD_ITEM = "additem",
    ON_TICK = "tick",
    CHANGE_ENERGY = "chgenergy",
    CHANGE_SELECTED = "chgselected",
    CHANGE_GOAL = "chggoal",
    RENDER = "render"
}

export function AddDroneEvent(pos_x: number, pos_y: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.ADD_DRONE, {detail: {pos_x: pos_x, pos_y:pos_y}});
    return self;
}

export function AddItemEvent(drone_id: number, item: Items, count: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.ADD_ITEM, {detail: {drone: drone_id, item: item, count: count}});
    return self;
}

export function TickEvent(): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.ON_TICK);
    return self;
}

export function ChangeEnergyEvent(drone_id: number, amount: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_ENERGY, {detail: {drone: drone_id, amount: amount}});
    return self;
}

export function ChangeSelectedEvent(drone_id: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_SELECTED, {detail: {drone: drone_id}});
    return self;
}

export function ChangeGoalEvent(drone_id: number, goal: Goals): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_GOAL, {detail: {drone: drone_id, goal: goal}});
    return self;
}

export function RenderEvent(game: GameState, delta: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.RENDER, {detail: {game: game, delta: delta}});
    return self;
}