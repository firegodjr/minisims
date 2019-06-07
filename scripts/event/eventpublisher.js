export function EventPublisher() {
    var self = this;
    self.subscribers = [];
}
export function EventPublisherf() {
    var self = this;
    self.push_to_subs = function (publisher, event) {
        for (var i = 0; i < publisher.subscribers.length; ++i) {
            var subEvent = new CustomEvent(event.type, event);
            document.getElementById(publisher.subscribers[i]).dispatchEvent(subEvent);
        }
    };
    /**
     * Subscribes a DOM element to the event publisher
     * @param {String} subscriber the id of the subscribing element
     */
    self.subscribe = function (publisher, subscriber) {
        publisher.subscribers.push(subscriber);
    };
    self.register_listeners = function (publisher, events) {
        var keys = Object.keys(events);
        var length = keys.length;
        for (var i = 0; i < length; ++i) {
            document.addEventListener(events[keys[i]], (e) => {
                self.push_to_subs(publisher, e);
            });
        }
    };
}
