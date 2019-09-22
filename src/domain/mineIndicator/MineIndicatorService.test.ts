import {MineIndicator} from "./MineIndicator";
import {createEventHandler} from "../../infrastructure/events/eventHandler";
import {MineIndicatorService} from "./MineIndicatorService";

describe('MineIndicatorService', () => {
    it('creates a minesweeper', () => {
        const eventPublisher = createEventHandler();
        const createdCallback = jest.fn();
        const mineIndicatorService = new MineIndicatorService(eventPublisher);

        eventPublisher.listen(MineIndicator.events.created, createdCallback);
        mineIndicatorService.create();

        expect(createdCallback).toBeCalledWith(new MineIndicator(eventPublisher));
    })
});