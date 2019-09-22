import {GameBoard} from "./GameBoard";
import {fireEvent, render} from "@testing-library/react";
import {minesweeperFactory} from "../../../domain/minesweeper/minesweeper";
import React from "react";
import {Coordinate} from "../../../domain/coordinate/coordinate";
import {MineType} from "../../../domain/minesweeper/field/mine";
import {createEventHandler} from "../../../infrastructure/events/eventHandler";
import {GameLevel} from "../../../domain/minesweeper/gameLevel";
import {MineIndicator} from "../../../domain/mineIndicator/MineIndicator";

describe('GameBoard', () => {

    it.each`
        gameLevel           | size
        ${GameLevel.EASY}   | ${6 * 9}
        ${GameLevel.MEDIUM} | ${9 * 12}
        ${GameLevel.HARD}   | ${12 * 15}
    `('Renders the game board size is $size for $gameLevel', ({gameLevel, size}) => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher)(gameLevel);
        const mineIndicator = new MineIndicator(eventPublisher);

        const {container} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);

        expect(container.children[0].children).toHaveLength(size);
    });

    it('starts a game at the first click', () => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher)(GameLevel.EASY);
        const mineIndicator = new MineIndicator(eventPublisher);

        const startGameSpy = jest.spyOn(game, 'sweep');

        const {getByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);
        fireEvent.click(getByLabelText('Coordinate 6x9'));

        expect(startGameSpy).toBeCalledWith(Coordinate.of({x: 5, y: 8}));
    });

    it('revels the selected coordinate without bombs', () => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher, () => () => MineType.NotMine)(GameLevel.EASY);
        const mineIndicator = new MineIndicator(eventPublisher)
        game.sweep(Coordinate.of({x: 5, y: 8}));

        const {queryByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);

        expect(queryByLabelText('Coordinate 6x9 reveled with no bomb near'))
            .not.toBeNull();
    });

    it('revels the selected coordinate with bombs', () => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher, () => () => MineType.Mine)(GameLevel.EASY);
        const mineIndicator = new MineIndicator(eventPublisher)

        game.sweep(Coordinate.of({x: 2, y: 2}));
        const {getByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);

        const revealedCoordinate = getByLabelText('Coordinate 3x3 reveled with 8 bombs near');
        expect(revealedCoordinate.innerHTML).toBe('8');
    });

    it('shows flagged positions', () => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher, () => () => MineType.Mine)(GameLevel.EASY);
        const mineIndicator = new MineIndicator(eventPublisher)
            .toggleFlag(Coordinate.of({x: 3, y: 3}));

        const {getByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);

        const revealedCoordinate = getByLabelText('Coordinate 4x4 flagged');
        expect(revealedCoordinate.innerHTML).toBe('🚩');
    });

    it('indicates a bomb when use context menu', () => {
        const flagAddedCallback = jest.fn();

        const eventPublisher = createEventHandler();
        eventPublisher.listen(MineIndicator.events.flagAdded, flagAddedCallback);

        const game = minesweeperFactory(eventPublisher, () => () => MineType.Mine)(GameLevel.EASY);
        const mineIndicator = new MineIndicator(eventPublisher);

        const {getByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);
        fireEvent.contextMenu(getByLabelText('Coordinate 4x4'));

        expect(flagAddedCallback).toBeCalled();
    });

    it('does nothing when click in a flagged coordinate', () => {
        const eventPublisher = createEventHandler();
        const game = minesweeperFactory(eventPublisher, () => () => MineType.Mine)(GameLevel.EASY);
        const startGameSpy = jest.spyOn(game, 'sweep');
        const mineIndicator = new MineIndicator(eventPublisher)
            .toggleFlag(Coordinate.of({x: 3, y: 3}));

        const {getByLabelText} = render(<GameBoard game={game} mineIndicator={mineIndicator} />);

        fireEvent.click(getByLabelText('Coordinate 4x4 flagged'));

        expect(startGameSpy).not.toBeCalled();
    });
});