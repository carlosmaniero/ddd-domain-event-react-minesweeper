import React, {useState} from "react";
import styled from "styled-components";
import {GamePositionButton, GamePositionProps} from "./GamePositionButton";
import {Minesweeper} from "../../domain/minesweeper";
import {Position} from "../../domain/position/position";

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

type GamePositionButtonHighlightedProps = GamePositionProps & {
    highlightedPositions :Position[]
}

const getHighlightedColor = (props: GamePositionButtonHighlightedProps) => {
    if (props.highlightedPositions.some(position => position.sameOf(props.boardPosition.position))) {
        return '#a3b6d2'
    }
    return '#d1dbf0';
};

export const GamePositionButtonHighlighted = styled(GamePositionButton)`
  border: 2px solid ${getHighlightedColor};
  transition: border 0.25s linear;
`;

export const GameBoard = ({game}: GameBoardProps) => {
    const [highlightedPositions, setPositions] = useState<Position[]>([]);

    return <GameBoardGrid {...game.boardSize()}>
        {
            game.boardPositions().map((boardPosition, index) =>
                <GamePositionButtonHighlighted
                    highlightedPositions={highlightedPositions}
                    onMouseEnter={() => setPositions(boardPosition.position.getAdjacent())}
                    onClick={() => game.revealPosition(boardPosition.position)}
                    boardPosition={boardPosition} key={index}/>)
        }
    </GameBoardGrid>
};