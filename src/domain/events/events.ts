export type Event<T> = {
    type: string,
    payload: T
}

export type EventCreator<T> = {
    (payload: T): Event<T>;
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
        {isTypeOf: isTypeOf<T>(type)}
        );