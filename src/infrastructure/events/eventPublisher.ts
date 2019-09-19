import {Event, EventCreator, EventPublisher} from "../../domain/events/events";


export type EventPublisherCallback<T> = (payload: T) => void;
export type EventMap = {
    [eventType: string]: Array<EventPublisherCallback<unknown>>
}
const eventMap = (callbackMap: EventMap = {}) => {
    const getCallbacksFromEventCreator = (eventCreator: EventCreator<unknown>) =>
        callbackMap[eventCreator.type] || [];

    const getCallback = <T>(event: Event<T>): Array<EventPublisherCallback<T>> => callbackMap[event.type] || [];

    const addCallback = <T>(eventCreator: EventCreator<T>, callback: EventPublisherCallback<T>) => {
        const callbacks: Array<EventPublisherCallback<unknown>> =
            getCallbacksFromEventCreator(eventCreator as EventCreator<unknown>);

        const newCallbacksForEvent = [
            ...callbacks,
            callback as EventPublisherCallback<unknown>
        ];

        const newCallbackMap: EventMap = {
            ...callbackMap,
            [eventCreator.type]: newCallbacksForEvent
        };

        return eventMap(newCallbackMap);
    };

    return {addCallback, getCallback}
};

export const eventPublisherBuilder = (events = eventMap()) => {
    return {
        listen: <T>(eventCreator: EventCreator<T>, callback: EventPublisherCallback<T>) => {
            return eventPublisherBuilder(events.addCallback(eventCreator, callback));
        },
        build: (): EventPublisher => ({
            publish: (event) => events.getCallback(event)
                .forEach(callback => callback(event.payload))
        }),
    }
};