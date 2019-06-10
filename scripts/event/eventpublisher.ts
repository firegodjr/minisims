import { Events } from "./events.js";

class EventPublisher
{
    subscribers: Array<string>;
    
    constructor()
    {
        this.subscribers = [];
    }
}

class EventPublisherf
{
    push_to_subs(publisher: EventPublisher, event: Event)
    {
        for(var i = 0; i < publisher.subscribers.length; ++i)
        {
            var subEvent = new CustomEvent(event.type, event);
            document.getElementById(publisher.subscribers[i]).dispatchEvent(subEvent);
        }
    }

    /**
     * Subscribes a DOM element to the event publisher
     * @param {String} subscriber the id of the subscribing element
     */
    subscribe(publisher: EventPublisher, subscriber: string)
    {
        publisher.subscribers.push(subscriber);
    }

    register_listeners(publisher: EventPublisher)
    {
        let keys =  Object.keys(Events);
        let length = keys.length;
        for(var i = 0; i < length; ++i)
        {
            document.addEventListener(Events[keys[i] as keyof typeof Events], (e) => {
                this.push_to_subs(publisher, e);
            });
        }
    }
}

export { EventPublisher, EventPublisherf as EventPublisherHelper };