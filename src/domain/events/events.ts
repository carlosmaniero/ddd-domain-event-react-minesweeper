export type Event<T> = {
    type: string,
    payload: T
}

export type EventCreator<T> = {
    (payload: T): Event<T>;
    type: string;
    isTypeOf: (event: Event<unknown>) => event is Event<T>
};

export interface EventPublisher {
    publish: (event: Event<unknown>) => void
}

const isTypeOf = <T>(type: string) =>
    (event: Event<unknown>): event is Event<T> => event.type === type;

export const eventCreator = <T>(type: string): EventCreator<T> =>
    Object.assign(
        (payload: T) => ({type, payload}),
        {
            type,
            isTypeOf: isTypeOf<T>(type)
        });


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