export const Events = {
    ADD_DRONE: "adddrone",
    ADD_ITEM: "additem",
    ON_TICK: "tick",
    CHANGE_ENERGY: "chgenergy",
    CHANGE_SELECTED: "chgselected",
    CHANGE_GOAL: "chggoal",
    RENDER: "render"
}

export function AddDroneEvent(pos_x, pos_y)
{
    var self = this;
    self = new CustomEvent(Events.ADD_DRONE, {detail: {pos_x: pos_x, pos_y:pos_y}});
    return self;
}

export function AddItemEvent(drone, item, count)
{
    var self = this;
    self = new CustomEvent(Events.ADD_ITEM, {detail: {drone: drone, item: item, count: count}});
    return self;
}

export function TickEvent()
{
    var self = this;
    self = new CustomEvent(Events.ON_TICK);
    return self;
}

export function ChangeEnergyEvent(drone, amount)
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_ENERGY, {detail: {drone: drone, amount: amount}});
    return self;
}

export function ChangeSelectedEvent(drone)
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_SELECTED, {detail: {drone: drone}});
    return self;
}

export function ChangeGoalEvent(drone, goal)
{
    var self = this;
    self = new CustomEvent(Events.CHANGE_GOAL, {detail: {drone: drone, goal: goal}});
    return self;
}

export function RenderEvent(game, delta)
{
    var self = this;
    self = new CustomEvent(Events.RENDER, {detail: {game: game, delta: delta}});
    return self;
}