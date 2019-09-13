import {Game} from "../../domain/game";
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

const GamePositionElement = styled.button`
  background: #CCCCCC;
`;

interface GamePositionProps {
    game: Game;
    position: Position
};

const GamePosition = ({game, position}: GamePositionProps) =>
    <GamePositionElement
        onClick={() => game.revealPosition(position)}
        aria-label={"Position " + positionToText(position)} />;

const positionToText = (position: Position) => (position.x + 1) + 'x' + (position.y + 1);

export const GameBoard = ({game}: GameBoardProps) =>
    <GameBoardGrid {...game.getBoardSize()}>
        {game.boardPositions()
            .map((boardPosition, index) => <GamePosition game={game} position={boardPosition.position} key={index} />)}
    </GameBoardGrid>;