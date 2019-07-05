import { Drone, StatTypes } from "../drone.js";
import { Items, Goals, TileTypes } from "../constants.js";
import { GameState } from "../game/game.js";

export enum Events
{
    ADD_DRONE = "adddrone",
    ADD_ITEM = "additem",
    ON_TICK = "tick",
    CHANGE_ENERGY = "chgenergy",
    CHANGE_SELECTED = "chgselected",
    CHANGE_GOAL = "chggoal",
    RENDER = "render",
    CHANGE_TILE = "chgtile"
}

export function AddDroneEvent(pos_x: number, pos_y: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.ADD_DRONE, {detail: {pos_x: pos_x, pos_y:pos_y}});
    return self;
}

export function AddItemEvent(drone_id: string, item: StatTypes, count: number): CustomEvent
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

export function ChangeEnergyEvent(drone_id: string, amount: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_ENERGY, {detail: {drone: drone_id, amount: amount}});
    return self;
}

export function ChangeSelectedEvent(drone_id: string): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_SELECTED, {detail: {drone: drone_id}});
    return self;
}

export function RenderEvent(game: GameState, delta: number): CustomEvent
{
    var self = this;
    self = new CustomEvent(Events.RENDER, {detail: {game: game, delta: delta}});
    return self;
}

export function ChangeTileEvent(x: number, y: number, type: TileTypes)
{
    return new CustomEvent(Events.CHANGE_TILE, {detail: {x: x, y: y, type: type}});
}