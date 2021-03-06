export type Event<T> = {
    type: string,
    payload: T
}

export interface EventPublisher {
    publish: (event: Event<unknown>) => void
}

export interface EventChecker<T> {
    isTypeOf: (event: Event<unknown>) => event is Event<T>
} 

export type EventCreator<T> = {
    (payload: T): Event<T>;
    type: string;
} & EventChecker<T>;

const isTypeOf = <T>(type: string) =>
    (event: Event<unknown>): event is Event<T> => event.type === type;

export const anyOf = <T>(eventCreators: EventCreator<T>[]): EventChecker<T> => ({
    isTypeOf: (event: Event<unknown>): event is Event<T> =>
        eventCreators.some((eventCreator) => eventCreator.isTypeOf(event))
});

export const eventCreator = <T>(type: string): EventCreator<T> =>
    Object.assign(
        (payload: T) => ({type, payload}),
        {
            type,
            isTypeOf: isTypeOf<T>(type)
        });