export type Event<T> = {
    type: string,
    payload: T
}

export type EventCreator<T> = (payload: T) => Event<T>;

export interface EventPublisher {
    publish: (event: Event<unknown>) => void
}

export const eventCreator = <T>(type: string): EventCreator<T> => (payload: T) => ({type, payload});