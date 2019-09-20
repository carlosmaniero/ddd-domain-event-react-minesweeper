import {fireEvent, render} from "@testing-library/react";
import React from "react";
import {LevelButton} from "./LevelButton";
import {GameLevel} from "../../domain/minesweeper/gameLevel";

describe('Level Button', () => {

    it.each`
        level               | levelName
        ${GameLevel.EASY}   | ${'Easy'}
        ${GameLevel.MEDIUM} | ${'Medium'}
        ${GameLevel.HARD}   | ${'Hard'}
    `('click on the $levelName Button', ({level, levelName}) => {
        const onClick = jest.fn();
        const { getByText } = render(<LevelButton level={level} onClick={onClick} />);

        fireEvent.click(getByText(levelName));

        expect(onClick).toBeCalledTimes(1);
    });
});