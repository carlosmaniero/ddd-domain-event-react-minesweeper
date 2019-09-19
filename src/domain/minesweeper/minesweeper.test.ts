import {gameFactory, GameLevel, Minesweeper} from "./minesweeper";
import {Position} from "../position/position";
import {MineType} from "./board/mine";

describe('Game', () => {
    const createGameWithMockedDependencies = () => {
        let mineFactory = jest.fn();
        let publisher = jest.fn();

        return {
            mineFactory,
            publisher,
            createGame: gameFactory({publish: publisher}, mineFactory),
        }
    };

    it('publish an event when a game is created', () => {
        const {publisher, createGame} = createGameWithMockedDependencies();

        const game = createGame(GameLevel.EASY);
        expect(publisher).toBeCalledWith(Minesweeper.events.created(game));
    });

    describe('starting game', () => {
        it('publish an event with a started game', () => {
            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();
            mineFactory.mockReturnValue(() => MineType.Mine);

            const game = createGame(GameLevel.EASY);
            const startedGame = game.revealPosition(Position.of({x: 0, y: 0}));

            expect(publisher).toBeCalledTimes(2);
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
                const initialPosition = Position.of({x: 0, y: 0});

                game.revealPosition(initialPosition);

                expect(mineFactory).toBeCalledWith(initialPosition, probability);
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
                const initialPosition = Position.of({x: 0, y: 0});
                const startedGame = game.revealPosition(initialPosition);

                expect(startedGame.boardSize().width).toEqual(width);
                expect(startedGame.boardSize().height).toEqual(height);
            });
        });
    });

    describe('revealing a position', () => {
        describe('with a not started game', () => {
            it('Revel a position with no mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const revealedPosition = Position.of({x: 1, y: 2});
                const game = createGame(GameLevel.EASY);
                const startedGame = game.revealPosition(revealedPosition);

                const position = startedGame.boardPositions()[13];
                expect(position).toEqual({
                    type: 'REVEALED_WITH_NO_BOMB_NEAR',
                    position: revealedPosition
                });
            });

            it('revel a position with mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const revealedPosition = Position.of({x: 1, y: 2});
                const game = createGame(GameLevel.EASY);
                const startedGame = game.revealPosition(revealedPosition);
                const position = startedGame.boardPositions()[13];

                expect(position).toEqual({
                    type: 'REVEALED_WITH_BOMB_NEAR',
                    position: revealedPosition,
                    bombCount: 8
                });
            });
        });

        describe('with a started game', () => {
            it('publish an event when a position is revealed', () => {
                const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

                const initialPosition = Position.of({x: 0, y: 0});
                const revealPosition = Position.of({x: 1, y: 1});
                const anyOtherPosition = Position.of({x: 1, y: 2});

                mineFactory.mockReturnValue((position: Position) =>
                    position.sameOf(initialPosition) || position.sameOf(revealPosition) || position.sameOf(anyOtherPosition)
                     ? MineType.NotMine
                     : MineType.Mine);

                const game = createGame(GameLevel.EASY);

                const revealPositionGame = game
                    .revealPosition(initialPosition)
                    .revealPosition(revealPosition);

                expect(publisher).toHaveBeenNthCalledWith(3, Minesweeper.events.revealed(revealPositionGame));
            });

            it('Revel a position with no mine near', () => {
                const {createGame, mineFactory} = createGameWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const game = createGame(GameLevel.EASY);
                const startedGame = game
                    .revealPosition(Position.of({x: 1, y: 2}))
                    .revealPosition(Position.of({x: 2, y: 2}));

                const position = startedGame.boardPositions()[14];

                expect(position).toEqual({
                    type: 'REVEALED_WITH_NO_BOMB_NEAR',
                    position: Position.of({x: 2, y: 2})
                });
            });
        });
    });

    describe('game over', () => {
        it('publish an event', () => {
            const initialPosition = Position.of({x: 0, y: 0});
            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((position: Position) =>
                position.sameOf(initialPosition) ? MineType.NotMine : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealPositionGame = game
                .revealPosition(initialPosition)
                .revealPosition(Position.of({x: 1, y: 1}));

            expect(publisher).toHaveBeenNthCalledWith(3, Minesweeper.events.gameOver(revealPositionGame));
        });

        it('marks it self as game over', () => {
            const initialPosition = Position.of({x: 0, y: 0});
            const {createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((position: Position) =>
                position.sameOf(initialPosition) ? MineType.NotMine : MineType.Mine);

            const game = createGame(GameLevel.EASY).revealPosition(initialPosition);

            expect(game.isGameOver()).toBeFalsy();

            const revealPositionGame = game
                .revealPosition(Position.of({x: 1, y: 1}));

            expect(revealPositionGame.isGameOver()).toBeTruthy();
        });

        it('prevents new reveals after a game over', () => {
            const initialPosition = Position.of({x: 0, y: 0});
            const afterGameOverRevealPosition = Position.of({x: 2, y: 2});

            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((position: Position) =>
                position.sameOf(initialPosition) || position.sameOf(afterGameOverRevealPosition)
                    ? MineType.NotMine
                    : MineType.Mine);

            createGame(GameLevel.EASY)
                .revealPosition(initialPosition)
                .revealPosition(Position.of({x: 1, y: 1}))
                .revealPosition(afterGameOverRevealPosition);

            expect(publisher).toBeCalledTimes(3);
        });
    });

    describe('finishing the game', () => {
        it('publish an event', () => {
            const initialPosition = Position.of({x: 0, y: 0});
            const finishingPosition = Position.of({x: 1, y: 1});

            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((position: Position) =>
                position.sameOf(initialPosition) || position.sameOf(finishingPosition)
                    ? MineType.NotMine
                    : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealPositionGame = game
                .revealPosition(initialPosition)
                .revealPosition(finishingPosition);

            expect(publisher).toHaveBeenNthCalledWith(3, Minesweeper.events.finished(revealPositionGame));
        });

        it('marks as finished', () => {
            const initialPosition = Position.of({x: 0, y: 0});
            const finishingPosition = Position.of({x: 1, y: 1});

            const {createGame, mineFactory} = createGameWithMockedDependencies();

            mineFactory.mockReturnValue((position: Position) =>
                position.sameOf(initialPosition) || position.sameOf(finishingPosition)
                    ? MineType.NotMine
                    : MineType.Mine);

            const game = createGame(GameLevel.EASY);

            const revealPositionGame = game
                .revealPosition(initialPosition)
                .revealPosition(finishingPosition);

            expect(revealPositionGame.isFinished()).toBeTruthy();
        });
    });
});