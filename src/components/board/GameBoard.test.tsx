import {GameBoard} from "./GameBoard";
import {fireEvent, render} from "@testing-library/react";
import {gameFactory, GameLevel} from "../../domain/game";
import {eventPublisherBuilder} from "../../domain/events/events";
import React from "react";
import {Position} from "../../domain/position/position";

describe('GameBoard', () => {

    it.each`
        gameLevel           | size
        ${GameLevel.EASY}   | ${6 * 9}
        ${GameLevel.MEDIUM} | ${9 * 12}
        ${GameLevel.HARD}   | ${12 * 15}
    `('Renders the game board size is $size for $gameLevel', ({gameLevel, size}) => {
        const game = gameFactory(eventPublisherBuilder().build())(gameLevel);

        const {container} = render(<GameBoard game={game}/>);

        expect(container.children[0].children).toHaveLength(size);
    });

    it('starts a game at the first click', () => {
        const game = gameFactory(eventPublisherBuilder().build())(GameLevel.EASY);
        const startGameSpy = jest.spyOn(game, 'revealPosition');

        const {getByLabelText} = render(<GameBoard game={game}/>);
        fireEvent.click(getByLabelText('Position 6x9'));

        expect(startGameSpy).toBeCalledWith(Position.of({x: 5, y: 8}));
    });
});