import styled from "styled-components";
import React from "react";
import {Position} from "../../domain/position/position";
import {
    BoardPosition,
    isRevealed,
    isRevealedWithBombsNear,
    isRevealedWithNoBombNear
} from "../../domain/position/boardPosition";

interface GamePositionElementProps {
    boardPosition: BoardPosition
}


const textColor = ({boardPosition}: GamePositionElementProps) => {
    if (!isRevealedWithBombsNear(boardPosition)) {
        return '#000000';
    }

    switch (boardPosition.bombCount) {
        case 1:
            return '#42b5e6';
        case 2:
            return '#6de637';
        case 3:
            return '#e6e62d';
        case 4:
            return '#e6b13a';
        case 5:
            return '#bf6be6';
        case 6:
            return '#e6549f';
        case 7:
            return '#e65282';
    }
    return '#E64D5A';
};

export const GamePositionElement = styled.button`
  background: ${({boardPosition}: GamePositionElementProps) => isRevealed(boardPosition) ? '#FCFCFC' : '#EFEFEF'};
  font-size: 2rem;
  color: ${textColor};
`;

export interface GamePositionProps {
    boardPosition: BoardPosition;
    onClick: () => void;
    onMouseEnter: () => void;
    className?: string;
}

const boardPositionAriaLabel = (boardPosition: BoardPosition) => {
    if (isRevealedWithNoBombNear(boardPosition)) {
        return `Position ${positionToText(boardPosition.position)} reveled with no bomb near`;
    }

    if (isRevealedWithBombsNear(boardPosition)) {
        return `Position ${positionToText(boardPosition.position)} reveled with ${boardPosition.bombCount} bombs near`;
    }

    return `Position ${positionToText(boardPosition.position)}`;
};

const boardPositionText = (boardPosition: BoardPosition) => {
    if (isRevealedWithBombsNear(boardPosition)) {
        return boardPosition.bombCount;
    }

    return null;
};

const positionToText = (position: Position) => (position.x + 1) + 'x' + (position.y + 1);

export const GamePositionButton = ({onClick, onMouseEnter, boardPosition, className}: GamePositionProps) =>
    <GamePositionElement
        onClick={() => onClick()}
        className={className}
        onMouseEnter={() => onMouseEnter()}
        aria-label={boardPositionAriaLabel(boardPosition)}
        boardPosition={boardPosition}>
        {boardPositionText(boardPosition)}
    </GamePositionElement>;