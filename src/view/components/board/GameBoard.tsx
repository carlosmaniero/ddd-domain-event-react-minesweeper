import React, {useState} from "react";
import styled from "styled-components";
import {GameCoordinateButton, GameCoordinateProps} from "./GameCoordinateButton";
import {Minesweeper} from "../../../domain/minesweeper/minesweeper";
import {Coordinate} from "../../../domain/coordinate/coordinate";

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

type GameCoordinateButtonHighlightedProps = GameCoordinateProps & {
    highlightedCoordinates :Coordinate[]
}

const getHighlightedColor = (props: GameCoordinateButtonHighlightedProps) => {
    if (props.highlightedCoordinates.some(coordinate => coordinate.sameOf(props.boardCoordinate.coordinate))) {
        return '#a3b6d2'
    }
    return '#d1dbf0';
};

export const GameCoordinateButtonHighlighted = styled(GameCoordinateButton)`
  border: 2px solid ${getHighlightedColor};
  transition: border 0.25s linear;
`;

export const GameBoard = ({game}: GameBoardProps) => {
    const [highlightedCoordinates, setCoordinates] = useState<Coordinate[]>([]);

    return <GameBoardGrid {...game.boardSize()}>
        {
            game.boardCoordinates().map((boardCoordinate, index) =>
                <GameCoordinateButtonHighlighted
                    highlightedCoordinates={highlightedCoordinates}
                    onMouseEnter={() => setCoordinates(boardCoordinate.coordinate.getAdjacent())}
                    onClick={() => game.sweep(boardCoordinate.coordinate)}
                    boardCoordinate={boardCoordinate} key={index}/>)
        }
    </GameBoardGrid>
};