import styled from "styled-components";
import React from "react";
import {Coordinate} from "../../../domain/coordinate/coordinate";
import {
    BoardCoordinate, isFlagged,
    isRevealed,
    isRevealedWithBombsNear,
    isRevealedWithNoBombNear
} from "../../presenters/boardCoordinate";

interface GameCoordinateElementProps {
    boardCoordinate: BoardCoordinate
}

const textColor = ({boardCoordinate}: GameCoordinateElementProps) => {
    if (!isRevealedWithBombsNear(boardCoordinate)) {
        return '#000000';
    }

    switch (boardCoordinate.bombCount) {
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

const calculateBackground = ({boardCoordinate}: GameCoordinateElementProps) =>
    isRevealed(boardCoordinate) ? '#FCFCFC' : '#EFEFEF';

const calculateFontSize = ({boardCoordinate}: GameCoordinateElementProps) =>
    isFlagged(boardCoordinate) ? '0.6rem' : '1.2rem';

export const GameCoordinateElement = styled.button`
  background: ${calculateBackground};
  font-size: ${calculateFontSize};
  color: ${textColor};
`;

export interface GameCoordinateProps {
    boardCoordinate: BoardCoordinate;
    onClick: () => void;
    onContextMenu: () => void;
    onMouseEnter: () => void;
    className?: string;
}

const boardCoordinateAriaLabel = (boardCoordinate: BoardCoordinate) => {
    if (isFlagged(boardCoordinate)) {
        return `Coordinate ${coordinateToText(boardCoordinate.coordinate)} flagged`;
    }

    if (isRevealedWithNoBombNear(boardCoordinate)) {
        return `Coordinate ${coordinateToText(boardCoordinate.coordinate)} reveled with no bomb near`;
    }

    if (isRevealedWithBombsNear(boardCoordinate)) {
        return `Coordinate ${coordinateToText(boardCoordinate.coordinate)} reveled with ${boardCoordinate.bombCount} bombs near`;
    }

    return `Coordinate ${coordinateToText(boardCoordinate.coordinate)}`;
};

const boardCoordinateText = (boardCoordinate: BoardCoordinate) => {
    if (isFlagged(boardCoordinate)) {
        return '🚩';
    }

    if (isRevealedWithBombsNear(boardCoordinate)) {
        return boardCoordinate.bombCount;
    }

    return null;
};

const coordinateToText = (coordinate: Coordinate) => (coordinate.x + 1) + 'x' + (coordinate.y + 1);

export const GameCoordinateButton = ({onClick, onMouseEnter, boardCoordinate, className, onContextMenu}: GameCoordinateProps) =>
    <GameCoordinateElement
        onClick={() => onClick()}
        onContextMenu={(e) => { e.preventDefault(); onContextMenu() }}
        className={className}
        onMouseEnter={() => onMouseEnter()}
        aria-label={boardCoordinateAriaLabel(boardCoordinate)}
        boardCoordinate={boardCoordinate}>
        {boardCoordinateText(boardCoordinate)}
    </GameCoordinateElement>;