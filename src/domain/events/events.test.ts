import {eventCreator, Event, EventCreator} from "./events";

describe('Domain Events', () => {
    it('creates an event', () => {
        const event: EventCreator<number> = eventCreator('MY_EVENT');

        expect(event(42)).toEqual({
            type: 'MY_EVENT',
            payload: 42
        });
    });
});