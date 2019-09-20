import {GameBoard} from "./GameBoard";
import {fireEvent, render} from "@testing-library/react";
import {minesweeperFactory} from "../../domain/minesweeper/minesweeper";
import React from "react";
import {Position} from "../../domain/position/position";
import {MineType} from "../../domain/minesweeper/board/mine";
import {createEventHandler} from "../../infrastructure/events/eventHandler";
import {GameLevel} from "../../domain/minesweeper/gameLevel";

describe('GameBoard', () => {

    it.each`
        gameLevel           | size
        ${GameLevel.EASY}   | ${6 * 9}
        ${GameLevel.MEDIUM} | ${9 * 12}
        ${GameLevel.HARD}   | ${12 * 15}
    `('Renders the game board size is $size for $gameLevel', ({gameLevel, size}) => {
        const game = minesweeperFactory(createEventHandler())(gameLevel);

        const {container} = render(<GameBoard game={game}/>);

        expect(container.children[0].children).toHaveLength(size);
    });

    it('starts a game at the first click', () => {
        const game = minesweeperFactory(createEventHandler())(GameLevel.EASY);
        const startGameSpy = jest.spyOn(game, 'revealPosition');

        const {getByLabelText} = render(<GameBoard game={game}/>);
        fireEvent.click(getByLabelText('Position 6x9'));

        expect(startGameSpy).toBeCalledWith(Position.of({x: 5, y: 8}));
    });

    it('revels the selected position without bombs', () => {
        const game = minesweeperFactory(createEventHandler(), () => () => MineType.NotMine)(GameLevel.EASY);
        const gameWithRevealedPosition = game.revealPosition(Position.of({x: 5, y: 8}));
        const {queryByLabelText} = render(<GameBoard game={gameWithRevealedPosition}/>);

        expect(queryByLabelText('Position 6x9 reveled with no bomb near'))
            .not.toBeNull();
    });

    it('revels the selected position with bombs', () => {
        const game = minesweeperFactory(createEventHandler(), () => () => MineType.Mine)(GameLevel.EASY);
        const gameWithRevealedPosition = game.revealPosition(Position.of({x: 2, y: 2}));
        const {getByLabelText} = render(<GameBoard game={gameWithRevealedPosition}/>);

        const revealedPosition = getByLabelText('Position 3x3 reveled with 8 bombs near');
        expect(revealedPosition.innerHTML).toBe('8');
    });
});