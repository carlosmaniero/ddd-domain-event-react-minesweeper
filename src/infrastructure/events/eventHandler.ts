import {Event, EventChecker, EventPublisher} from "../../domain/events/events";

export type EventPublisherCallback<T> = (payload: T) => void;
export type SubscriptionID = number;

interface Subscription {
    eventCreator: EventChecker<unknown>;
    callback: EventPublisherCallback<unknown>;
    subscriptionID: SubscriptionID
}

export type EventHandler = EventPublisher & {
    listen: <T>(eventCreator: EventChecker<T>, callback: EventPublisherCallback<T>) => SubscriptionID,
    unsubscribe: (subscriptionID: SubscriptionID) => void
}

export const createEventHandler = (): EventHandler => {
    let subscriptions: Subscription[] = [];
    let subscriptionID: SubscriptionID = 0;

    return {
        listen<T>(eventChecker: EventChecker<T>, callback: EventPublisherCallback<T>) {
            subscriptionID++;

            subscriptions.push({
                subscriptionID: subscriptionID,
                eventCreator: (eventChecker as EventChecker<unknown>),
                callback: (callback as EventPublisherCallback<unknown>)
            });

            return subscriptionID;
        },
        publish(event: Event<unknown>) {
            const clonedPayload = typeof event.payload === 'object'
                ? Object.assign(Object.create(Object.getPrototypeOf(event.payload)), event.payload)
                : event.payload;
            subscriptions
                .filter(subscription => subscription.eventCreator.isTypeOf(event))
                .forEach(subscription => subscription.callback(clonedPayload));
        },
        unsubscribe(subscriptionID: SubscriptionID) {
            subscriptions = subscriptions
                .filter(subscription => subscription.subscriptionID !== subscriptionID);
        }
    }
};