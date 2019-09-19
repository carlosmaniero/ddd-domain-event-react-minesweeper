import {MineIndicator} from "./MineIndicator";
import {Position} from "../position/position";
import {eventPublisherBuilder} from "../../infrastructure/events/eventPublisher";

describe('MineIndicator', () => {
    describe('Adding a flag', () => {
        it('publishes an event when a position is added', () => {
            const flagAddedCallback = jest.fn();
            const eventPublisher = eventPublisherBuilder()
                .listen(MineIndicator.events.flagAdded, flagAddedCallback)
                .build();
            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator.toggleFlag(Position.of({x: 0, y: 0}));

            expect(flagAddedCallback).toHaveBeenNthCalledWith(1, mineIndicatorAfterToggle)
        });

        it('marks flagged', () => {
            const eventPublisher = eventPublisherBuilder().build();
            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator.toggleFlag(Position.of({x: 0, y: 0}));

            expect(mineIndicatorAfterToggle.isFlagged(Position.of({x: 0, y: 0}))).toBeTruthy();
        });
    });

    describe('Removing a flag', () => {
        it('publishes an event when a position is removed', () => {
            const flagRemovedCallback = jest.fn();
            const eventPublisher = eventPublisherBuilder()
                .listen(MineIndicator.events.flagRemoved, flagRemovedCallback)
                .build();
            const mineIndicator = new MineIndicator(eventPublisher);
            const mineIndicatorAfterToggle = mineIndicator
                .toggleFlag(Position.of({x: 0, y: 0}))
                .toggleFlag(Position.of({x: 0, y: 0}));

            expect(flagRemovedCallback).toHaveBeenNthCalledWith(1, mineIndicatorAfterToggle)
        });

        it('marks as not flagged', () => {
            const eventPublisher = eventPublisherBuilder().build();
            const mineIndicator = new MineIndicator(eventPublisher);

            const mineIndicatorAfterToggle = mineIndicator
                .toggleFlag(Position.of({x: 0, y: 0}))
                .toggleFlag(Position.of({x: 0, y: 0}));

            expect(mineIndicatorAfterToggle.isFlagged(Position.of({x: 0, y: 0}))).toBeFalsy();
        });
    });
});