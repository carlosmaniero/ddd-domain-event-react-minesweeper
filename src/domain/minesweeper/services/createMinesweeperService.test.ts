import {Minesweeper} from "../minesweeper";
import {CreateMinesweeperService} from "./createMinesweeperService";
import {GameLevel} from "../gameLevel";

describe('createMinesweeperService', () => {
    it('publish an event when a game is created', () => {
        let publisher = jest.fn();

        const createMinesweeperService = new CreateMinesweeperService({publish: publisher});
        createMinesweeperService.create(GameLevel.EASY);
        expect(publisher).toBeCalledTimes(1);

        const publishedEvent = publisher.mock.calls[0][0];
        const minesweeper: Minesweeper = publishedEvent.payload;

        expect(Minesweeper.events.created.isTypeOf(publishedEvent)).toBeTruthy();
        expect(minesweeper.gameLevel).toEqual(GameLevel.EASY);
    });
});