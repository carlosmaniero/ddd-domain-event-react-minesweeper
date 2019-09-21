import {MineIndicator} from "./MineIndicator";
import {Coordinate} from "../coordinate/coordinate";
import {createEventHandler} from "../../infrastructure/events/eventHandler";

describe('MineIndicator', () => {
    describe('Adding a flag', () => {
        it('publishes an event when a coordinate is added', () => {
            const flagAddedCallback = jest.fn();
            const eventPublisher = createEventHandler();
            eventPublisher.listen(MineIndicator.events.flagAdded, flagAddedCallback);

            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator.toggleFlag(Coordinate.of({x: 0, y: 0}));

            expect(flagAddedCallback).toHaveBeenNthCalledWith(1, mineIndicatorAfterToggle)
        });

        it('marks flagged', () => {
            const eventPublisher = createEventHandler();
            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator.toggleFlag(Coordinate.of({x: 0, y: 0}));

            expect(mineIndicatorAfterToggle.isFlagged(Coordinate.of({x: 0, y: 0}))).toBeTruthy();
        });
    });

    describe('Removing a flag', () => {
        it('publishes an event when a coordinate is removed', () => {
            const flagRemovedCallback = jest.fn();
            const eventPublisher = createEventHandler()
            eventPublisher.listen(MineIndicator.events.flagRemoved, flagRemovedCallback);
            const mineIndicator = new MineIndicator(eventPublisher);
            const mineIndicatorAfterToggle = mineIndicator
                .toggleFlag(Coordinate.of({x: 0, y: 0}))
                .toggleFlag(Coordinate.of({x: 0, y: 0}));

            expect(flagRemovedCallback).toHaveBeenNthCalledWith(1, mineIndicatorAfterToggle)
        });

        it('marks as not flagged', () => {
            const eventPublisher = createEventHandler();
            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator
                .toggleFlag(Coordinate.of({x: 0, y: 0}))
                .toggleFlag(Coordinate.of({x: 0, y: 0}));

            expect(mineIndicatorAfterToggle.isFlagged(Coordinate.of({x: 0, y: 0}))).toBeFalsy();
        });
    });
});