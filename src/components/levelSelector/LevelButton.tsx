import {RegularButton, RegularButtonProps} from "../designSystem/buttons/RegularButton";
import React from "react";
import styled from "styled-components";
import {GameLevel} from "../../domain/minesweeper/gameLevel";

export interface LevelButtonProps {
    onClick: () => void;
    level: GameLevel;
    className?: string;
}

type LevelRegularButtonProps = RegularButtonProps & LevelButtonProps;

const backgroundColor = (props: LevelRegularButtonProps) => {
    switch (props.level) {
        case GameLevel.EASY:
            return '#E6FFD9';
        case GameLevel.MEDIUM:
            return '#FFE67F';
        case GameLevel.HARD:
            return '#E64D5A';
    }
};

const backgroundColorHover = (props: LevelRegularButtonProps) => {
    switch (props.level) {
        case GameLevel.EASY:
            return '#d2ebc6';
        case GameLevel.MEDIUM:
            return '#ebd276';
        case GameLevel.HARD:
            return '#eb4d5a';
    }
};

const LevelRegularButton = styled(RegularButton)`
    background-color: ${backgroundColor}
    transition: background-color 0.5s ease-in-out, box-shadow 0.2s ease-in-out;
    
    &:hover {
       background-color: ${backgroundColorHover}
    }
`;

export const LevelButton = ({onClick, level, className}: LevelButtonProps) =>
    <LevelRegularButton onClick={() => onClick()} className={className} level={level}>{level}</LevelRegularButton>;