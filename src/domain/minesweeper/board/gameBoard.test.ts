import {MineCreator, MineType} from "./mine";
import {createGameBoard} from "./gameBoard";
import {Position} from "../../position/position";

describe('gameBoard', () => {
    let mineCreator: jest.Mock;

    beforeEach(() => {
        mineCreator = jest.fn();

        mineCreator
            .mockReturnValueOnce(MineType.NotMine)
            .mockReturnValueOnce(MineType.Mine)
            .mockReturnValueOnce(MineType.Mine)
            .mockReturnValueOnce(MineType.NotMine);
    });

    it('renders the board with the given mine creator', () => {
        const board = createGameBoard(mineCreator)({width: 2, height: 2});

        expect(board.board).toEqual([
            [MineType.NotMine, MineType.Mine],
            [MineType.Mine, MineType.NotMine]
        ]);
    });

    it('calls the mine creator with the board positions', () => {
        createGameBoard(mineCreator)({width: 2, height: 2});

        expect(mineCreator).toBeCalledTimes(4);
        expect(mineCreator).toHaveBeenNthCalledWith(1, Position.of({x: 0, y: 0}));
        expect(mineCreator).toHaveBeenNthCalledWith(2, Position.of({x: 1, y: 0}));
        expect(mineCreator).toHaveBeenNthCalledWith(3, Position.of({x: 0, y: 1}));
        expect(mineCreator).toHaveBeenNthCalledWith(4, Position.of({x: 1, y: 1}));
    });

    describe('counting bombs', () => {
        it('calculates the total of mines at the ', () => {
            mineCreator = jest.fn();

            mineCreator.mockReturnValue(MineType.NotMine);
            const board = createGameBoard(mineCreator)({width: 2, height: 2});
            expect(board.nearBombCount(Position.of({x: 0, y: 0}))).toEqual(0);
            expect(board.nearBombCount(Position.of({x: 1, y: 0}))).toEqual(0);
            expect(board.nearBombCount(Position.of({x: 0, y: 1}))).toEqual(0);
            expect(board.nearBombCount(Position.of({x: 1, y: 1}))).toEqual(0);
        });

        it('calculates the total of mines at the ', () => {
            mineCreator = jest.fn((position) =>
                position.x === 1 && position.y === 1
                    ? MineType.Mine : MineType.NotMine);

            const board = createGameBoard(mineCreator)({width: 3, height: 3});

            expect(board.nearBombCount(Position.of({x: 0, y: 0}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 1, y: 0}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 2, y: 0}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 0, y: 1}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 1, y: 1}))).toEqual(0);
            expect(board.nearBombCount(Position.of({x: 2, y: 1}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 0, y: 2}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 1, y: 2}))).toEqual(1);
            expect(board.nearBombCount(Position.of({x: 2, y: 2}))).toEqual(1);
        });

        it('calculates the sum of bombs ', () => {
            mineCreator = jest.fn();

            mineCreator.mockReturnValue(MineType.Mine);
            const board = createGameBoard(mineCreator)({width: 2, height: 2});

            expect(board.nearBombCount(Position.of({x: 0, y: 0}))).toEqual(3);
        });
    });
});