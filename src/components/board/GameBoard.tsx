import React from "react";
import styled from "styled-components";
import {GamePositionButton} from "./GamePositionButton";
import {Minesweeper} from "../../domain/minesweeper";

export interface GameBoardProps {
    game: Minesweeper
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

export const GameBoard = ({game}: GameBoardProps) =>
    <GameBoardGrid {...game.boardSize()}>
        {
            game.boardPositions().map((boardPosition, index) =>
                <GamePositionButton
                    onClick={() => game.revealPosition(boardPosition.position)}
                    boardPosition={boardPosition} key={index} />)
        }
    </GameBoardGrid>;