import {BoardPosition, Game, isRevealed, isRevealedWithBombsNear, isRevealedWithNoBombNear} from "../../domain/game";
import React from "react";
import styled from "styled-components";
import {Position} from "../../domain/position/position";

export interface GameBoardProps {
    game: Game
}

interface GameBoardGridProps {
    width: number;
    height: number;
}

const GameBoardGrid = styled.section`
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  width: 500px;
  height: ${(props: GameBoardGridProps) => (500 / props.width * props.height) + 'px'};
  grid-template-columns: repeat(${(props: GameBoardGridProps) => props.width}, 1fr);
  grid-template-rows: repeat(${(props: GameBoardGridProps) => props.height}, 1fr);
`;

interface GamePositionElementProps {
    boardPosition: BoardPosition
}

const GamePositionElement = styled.button`
  background: ${({boardPosition}: GamePositionElementProps) => isRevealed(boardPosition) ? '#FCFCFC' : '#EFEFEF'};
`;

interface GamePositionProps {
    game: Game;
    boardPosition: BoardPosition
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

const GamePosition = ({game, boardPosition}: GamePositionProps) =>
    <GamePositionElement
        onClick={() => game.revealPosition(boardPosition.position)}
        aria-label={boardPositionAriaLabel(boardPosition)}
        boardPosition={boardPosition}>
        {boardPositionText(boardPosition)}
    </GamePositionElement>;

const positionToText = (position: Position) => (position.x + 1) + 'x' + (position.y + 1);

export const GameBoard = ({game}: GameBoardProps) =>
    <GameBoardGrid {...game.getBoardSize()}>
        {game.boardPositions()
            .map((boardPosition, index) => <GamePosition game={game} boardPosition={boardPosition} key={index} />)}
    </GameBoardGrid>;