import {MineType} from "../../domain/minesweeper/field/mine";
import {Coordinate} from "../../domain/coordinate/coordinate";
import {GameLevel} from "../../domain/minesweeper/gameLevel";
import {minesweeperFactory} from "../../domain/minesweeper/minesweeper";
import {FieldPresenter} from "./FieldPresenter";
import {MineIndicator} from "../../domain/mineIndicator/MineIndicator";

describe('FieldPresenter', () => {
    const createGameWithMockedDependencies = () => {
        let mineFactory = jest.fn();
        let publisher = jest.fn();

        return {
            mineFactory,
            publisher,
            createGame: minesweeperFactory({publish: publisher}, mineFactory),
        }
    };

    it('revel a coordinate with no mine near', () => {
        const {createGame, mineFactory} = createGameWithMockedDependencies();
        mineFactory.mockReturnValue(() => MineType.NotMine);

        const revealedCoordinate = Coordinate.of({x: 1, y: 2});
        const game = createGame(GameLevel.EASY);

        game.sweep(revealedCoordinate);

        const coordinate = new FieldPresenter(game).boardCoordinates()[13];
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

        game.sweep(revealedCoordinate);

        const coordinate = new FieldPresenter(game).boardCoordinates()[13];

        expect(coordinate).toEqual({
            type: 'REVEALED_WITH_BOMB_NEAR',
            coordinate: revealedCoordinate,
            bombCount: 8
        });
    });

    it('returns flagged when flagged at mine indicator', () => {
        const {createGame, mineFactory, publisher} = createGameWithMockedDependencies();
        mineFactory.mockReturnValue(() => MineType.Mine);

        const flaggedCoordinate = Coordinate.of({x: 1, y: 2});
        const mineIndicator = new MineIndicator({publish: publisher}).toggleFlag(flaggedCoordinate);
        const game = createGame(GameLevel.EASY);

        const coordinate = new FieldPresenter(game, mineIndicator).boardCoordinates()[13];

        expect(coordinate).toEqual({
            type: 'FLAGGED',
            coordinate: flaggedCoordinate,
        });
    });
});