import {Event, EventCreator, EventPublisher} from "../../domain/events/events";

export type EventPublisherCallback<T> = (payload: T) => void;
export type SubscriptionID = number;

interface Subscription {
    eventCreator: EventCreator<unknown>;
    callback: EventPublisherCallback<unknown>;
    subscriptionID: SubscriptionID
}

export type EventHandler = EventPublisher & {
    listen: <T>(eventCreator: EventCreator<T>, callback: EventPublisherCallback<T>) => SubscriptionID,
    unsubscribe: (subscriptionID: SubscriptionID) => void
}

export const createEventHandler = (): EventHandler => {
    let subscriptions: Subscription[] = [];
    let subscriptionID: SubscriptionID = 0;

    return {
        listen<T>(eventCreator: EventCreator<T>, callback: EventPublisherCallback<T>) {
            subscriptionID++;

            subscriptions.push({
                subscriptionID: subscriptionID,
                eventCreator: (eventCreator as EventCreator<unknown>),
                callback: (callback as EventPublisherCallback<unknown>)
            });

            return subscriptionID;
        },
        publish(event: Event<unknown>) {
            subscriptions
                .filter(subscription => subscription.eventCreator.isTypeOf(event))
                .forEach(subscription => subscription.callback(event.payload));
        },
        unsubscribe(subscriptionID: SubscriptionID) {
            subscriptions = subscriptions
                .filter(subscription => subscription.subscriptionID !== subscriptionID);
        }
    }
};