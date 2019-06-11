import { Events } from "./events.js";
var EventPublisher = /** @class */ (function () {
    function EventPublisher() {
        this.subscribers = [];
    }
    return EventPublisher;
}());
var EventPublisherf = /** @class */ (function () {
    function EventPublisherf() {
    }
    EventPublisherf.prototype.push_to_subs = function (publisher, event) {
        for (var i = 0; i < publisher.subscribers.length; ++i) {
            var subEvent = new CustomEvent(event.type, event);
            document.getElementById(publisher.subscribers[i]).dispatchEvent(subEvent);
        }
    };
    /**
     * Subscribes a DOM element to the event publisher
     * @param {String} subscriber the id of the subscribing element
     */
    EventPublisherf.prototype.subscribe = function (publisher, subscriber) {
        publisher.subscribers.push(subscriber);
    };
    EventPublisherf.prototype.register_listeners = function (publisher) {
        var _this = this;
        var keys = Object.keys(Events);
        var length = keys.length;
        for (var i = 0; i < length; ++i) {
            document.addEventListener(Events[keys[i]], function (e) {
                _this.push_to_subs(publisher, e);
            });
        }
    };
    return EventPublisherf;
}());
export { EventPublisher, EventPublisherf as EventPublisherHelper };
