import {Game, gameFactory, GameLevel} from "./game";
import {Position} from "./position/position";
import {MineType} from "./board/mine";
import {GameBoard} from "./board/gameBoard";

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
        expect(publisher).toBeCalledWith(Game.events.created(game));
    });

    describe('starting game', () => {
        it('publish an event with a started game', () => {
            const {publisher, createGame, mineFactory} = createGameWithMockedDependencies();
            mineFactory.mockReturnValue(() => MineType.Mine);

            const game = createGame(GameLevel.EASY);
            const startedGame = game.revealPosition(Position.of({x: 0, y: 0}));

            expect(publisher).toBeCalledTimes(2);
            expect(publisher).toBeCalledWith(Game.events.started(startedGame));
        });

        it.each`
            mineType
            ${MineType.Mine}
            ${MineType.NotMine}
        `('create a board with all position as $mineType', ({mineType}) => {
            const {createGame, mineFactory} = createGameWithMockedDependencies();
            mineFactory.mockReturnValue(() => mineType);

            const game = createGame(GameLevel.EASY);
            const expectedBoard = new GameBoard([
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
                [mineType, mineType, mineType, mineType, mineType, mineType],
            ]);
            const startedGame = game.revealPosition(Position.of({x: 0, y: 0}));

            expect(startedGame.board).toEqual(expectedBoard);
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
                const board = startedGame.board as GameBoard;

                expect(board.getWidth()).toEqual(width);
                expect(board.getHeight()).toEqual(height);
            });
        });
    });
});