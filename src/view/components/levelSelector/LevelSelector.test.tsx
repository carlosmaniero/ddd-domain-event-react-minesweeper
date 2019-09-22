import {LevelSelector} from "./LevelSelector";
import {fireEvent, render} from "@testing-library/react";
import React from "react";
import {GameLevel} from "../../../domain/minesweeper/gameLevel";


describe('LevelSelector', () => {
    it.each`
        gameLevel
        ${GameLevel.EASY}
        ${GameLevel.MEDIUM}
        ${GameLevel.HARD}
    `('selects $gameLevel gameLevel', ({gameLevel}) => {
        const onSelect = jest.fn();

        const {getByText} = render(<LevelSelector onSelect={onSelect}/>);
        fireEvent.click(getByText(gameLevel));

        expect(onSelect).toBeCalledWith(gameLevel);
    });
});