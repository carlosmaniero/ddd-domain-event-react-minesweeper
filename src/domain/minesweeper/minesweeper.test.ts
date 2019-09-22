import {minesweeperFactory, Minesweeper} from "./minesweeper";
import {Coordinate} from "../coordinate/coordinate";
import {MineType} from "./field/mine";
import {GameLevel} from "./gameLevel";

describe('Game', () => {
    const createGameWithMockedDependencies = () => {
        let mineFactory = jest.fn();
        let publisher = jest.fn();

        return {
            mineFactory,
            publisher,
            createGame: minesweeperFactory({publish: publisher}, mineFactory),
        }
    };

    describe('starting game', () => {
        it('publish an event with a started game', () => {
            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();
            mineFactory.mockReturnValue(() => MineType.Mine);

            const game = createGame(GameLevel.EASY);
            const startedGame = game.sweep(Coordinate.of({x: 0, y: 0}));

            expect(publisher).toBeCalledTimes(1);
            expect(publisher).toBeCalledWith(Minesweeper.events.started(startedGame));
        });

        describe('Game Level', () => {
            it.each`
                probability | level
                ${0.2} | ${GameLevel.EASY}
                ${0.25} | ${GameLevel.MEDIUM}
                ${0.3} | ${GameLevel.HARD}
            `('mine factory probability is $probability for $level', ({probability, level}) => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const game = createGame(level);
                const initialCoordinate = Coordinate.of({x: 0, y: 0});

                game.sweep(initialCoordinate);

                expect(mineFactory).toBeCalledWith(initialCoordinate, probability);
            });

            it.each`
                width | height | level
                ${6} | ${9} | ${GameLevel.EASY}
                ${9} | ${12} | ${GameLevel.MEDIUM}
                ${12} | ${15} | ${GameLevel.HARD}
            `('board size is $width x $height for $level', ({width, height, level}) => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const game = createGame(level);
                const initialCoordinate = Coordinate.of({x: 0, y: 0});
                const startedGame = game.sweep(initialCoordinate);

                expect(startedGame.boardSize().width).toEqual(width);
                expect(startedGame.boardSize().height).toEqual(height);
            });
        });
    });

    describe('revealing a coordinate', () => {
        describe('with a not started game', () => {
            it('Revel a coordinate with no mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const revealedCoordinate = Coordinate.of({x: 1, y: 2});
                const game = createGame(GameLevel.EASY);
                const startedGame = game.sweep(revealedCoordinate);

                const coordinate = startedGame.boardCoordinates()[13];
                expect(coordinate).toEqual({
                    type: 'REVEALED_WITH_NO_BOMB_NEAR',
                    coordinate: revealedCoordinate
                });
            });

            it('revel a coordinate with mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const revealedCoordinate = Coordinate.of({x: 1, y: 2});
                const game = createGame(GameLevel.EASY);
                const startedGame = game.sweep(revealedCoordinate);
                const coordinate = startedGame.boardCoordinates()[13];

                expect(coordinate).toEqual({
                    type: 'REVEALED_WITH_BOMB_NEAR',
                    coordinate: revealedCoordinate,
                    bombCount: 8
                });
            });
        });

        describe('with a started game', () => {
            it('publish an event when a coordinate is revealed', () => {
                const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

                const initialCoordinate = Coordinate.of({x: 0, y: 0});
                const revealCoordinate = Coordinate.of({x: 1, y: 1});
                const anyOtherCoordinate = Coordinate.of({x: 1, y: 2});

                mineFactory.mockReturnValue((coordinate: Coordinate) =>
                    coordinate.sameOf(initialCoordinate) || coordinate.sameOf(revealCoordinate) || coordinate.sameOf(anyOtherCoordinate)
                     ? MineType.NotMine
                     : MineType.Mine);

                const game = createGame(GameLevel.EASY);

                const revealCoordinateGame = game
                    .sweep(initialCoordinate)
                    .sweep(revealCoordinate);

                expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.revealed(revealCoordinateGame));
            });

            it('Revel a coordinate with no mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const game = createGame(GameLevel.EASY);
                const startedGame = game
                    .sweep(Coordinate.of({x: 1, y: 2}))
                    .sweep(Coordinate.of({x: 2, y: 2}));

                const coordinate = startedGame.boardCoordinates()[14];

                expect(coordinate).toEqual({
                    type: 'REVEALED_WITH_NO_BOMB_NEAR',
                    coordinate: Coordinate.of({x: 2, y: 2})
                });
            });
        });
    });

    describe('game over', () => {
        it('publish an event', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) ? MineType.NotMine : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealCoordinateGame = game
                .sweep(initialCoordinate)
                .sweep(Coordinate.of({x: 1, y: 1}));

            expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.gameOver(revealCoordinateGame));
        });

        it('marks it self as game over', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const {createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) ? MineType.NotMine : MineType.Mine);

            const game = createGame(GameLevel.EASY).sweep(initialCoordinate);

            expect(game.bombExploded()).toBeFalsy();

            const revealCoordinateGame = game
                .sweep(Coordinate.of({x: 1, y: 1}));

            expect(revealCoordinateGame.bombExploded()).toBeTruthy();
        });

        it('prevents new reveals after a game over', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const afterGameOverRevealCoordinate = Coordinate.of({x: 2, y: 2});

            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(afterGameOverRevealCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            createGame(GameLevel.EASY)
                .sweep(initialCoordinate)
                .sweep(Coordinate.of({x: 1, y: 1}))
                .sweep(afterGameOverRevealCoordinate);

            expect(publisher).toBeCalledTimes(2);
        });
    });

    describe('finishing the game', () => {
        it('publish an event', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealCoordinateGame = game
                .sweep(initialCoordinate)
                .sweep(finishingCoordinate);

            expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.finished(revealCoordinateGame));
        });

        it('marks as finished', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealCoordinateGame = game
                .sweep(initialCoordinate)
                .sweep(finishingCoordinate);

            expect(revealCoordinateGame.completelyCleaned()).toBeTruthy();
        });

        it('does not allows bomb reveal after game finishes', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealCoordinateGame = game
                .sweep(initialCoordinate)
                .sweep(finishingCoordinate)
                .sweep(Coordinate.of({x: 2, y: 2}));

            expect(publisher).toHaveBeenLastCalledWith(Minesweeper.events.finished(revealCoordinateGame));
        });
    });
});