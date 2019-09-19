import {eventPublisherBuilder} from "./eventPublisher";
import {EventCreator, eventCreator} from "../../domain/events/events";

describe('Domain Events', () => {
    it('creates an event', () => {
        const event: EventCreator<number> = eventCreator('MY_EVENT');

        expect(event(42)).toEqual({
            type: 'MY_EVENT',
            payload: 42
        });
    });

    describe('EventPublisher', () => {
        const event1: EventCreator<number> = eventCreator('MY_EVENT_1');
        const event2: EventCreator<string> = eventCreator('MY_EVENT_2');
        const callback1_1 = jest.fn();
        const callback1_2 = jest.fn();
        const callback2 = jest.fn();



        const publisher = eventPublisherBuilder()
            .listen(event1, callback1_1)
            .listen(event1, callback1_2)
            .listen(event2, callback2)
            .build();

        publisher.publish(event1(42));
        publisher.publish(event2("Hello"));

        expect(callback1_1).toBeCalledWith(42);
        expect(callback1_2).toBeCalledWith(42);
        expect(callback2).toBeCalledWith("Hello");

        expect(callback1_1).toBeCalledTimes(1)
        expect(callback1_2).toBeCalledTimes(1)
        expect(callback2).toBeCalledTimes(1)
    });
});