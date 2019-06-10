export var Events;
(function (Events) {
    Events["ADD_DRONE"] = "adddrone";
    Events["ADD_ITEM"] = "additem";
    Events["ON_TICK"] = "tick";
    Events["CHANGE_ENERGY"] = "chgenergy";
    Events["CHANGE_SELECTED"] = "chgselected";
    Events["CHANGE_GOAL"] = "chggoal";
    Events["RENDER"] = "render";
})(Events || (Events = {}));
export function AddDroneEvent(pos_x, pos_y) {
    var self = this;
    self = new CustomEvent(Events.ADD_DRONE, { detail: { pos_x: pos_x, pos_y: pos_y } });
    return self;
}
export function AddItemEvent(drone_id, item, count) {
    var self = this;
    self = new CustomEvent(Events.ADD_ITEM, { detail: { drone: drone_id, item: item, count: count } });
    return self;
}
export function TickEvent() {
    var self = this;
    self = new CustomEvent(Events.ON_TICK);
    return self;
}
export function ChangeEnergyEvent(drone_id, amount) {
    var self = this;
    self = new CustomEvent(Events.CHANGE_ENERGY, { detail: { drone: drone_id, amount: amount } });
    return self;
}
export function ChangeSelectedEvent(drone_id) {
    var self = this;
    self = new CustomEvent(Events.CHANGE_SELECTED, { detail: { drone: drone_id } });
    return self;
}
export function ChangeGoalEvent(drone_id, goal) {
    var self = this;
    self = new CustomEvent(Events.CHANGE_GOAL, { detail: { drone: drone_id, goal: goal } });
    return self;
}
export function RenderEvent(game, delta) {
    var self = this;
    self = new CustomEvent(Events.RENDER, { detail: { game: game, delta: delta } });
    return self;
}
