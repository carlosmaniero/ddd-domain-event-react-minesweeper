import {Coordinate} from "./coordinate";

type BoardCoordinateNotRevealed = {
    type: 'NOT_REVEALED',
    coordinate: Coordinate
};

type BoardCoordinateRevealedWithBombNear = {
    type: 'REVEALED_WITH_BOMB_NEAR',
    bombCount: number,
    coordinate: Coordinate
};

type BoardCoordinateWithNoBombNear = {
    type: 'REVEALED_WITH_NO_BOMB_NEAR',
    coordinate: Coordinate
};

export type BoardCoordinate =
    BoardCoordinateNotRevealed
    | BoardCoordinateRevealedWithBombNear
    | BoardCoordinateWithNoBombNear;

export const isRevealedWithNoBombNear = (boardCoordinate: BoardCoordinate): boardCoordinate is BoardCoordinateWithNoBombNear =>
    boardCoordinate.type === 'REVEALED_WITH_NO_BOMB_NEAR';

export const isRevealedWithBombsNear = (boardCoordinate: BoardCoordinate): boardCoordinate is BoardCoordinateRevealedWithBombNear =>
    boardCoordinate.type === 'REVEALED_WITH_BOMB_NEAR';

export const isRevealed = (boardCoordinate: BoardCoordinate) =>
    isRevealedWithBombsNear(boardCoordinate) || isRevealedWithNoBombNear(boardCoordinate);

export const createNotRevealedCoordinate = (coordinate: Coordinate): BoardCoordinateNotRevealed => ({
    type: "NOT_REVEALED",
    coordinate: coordinate
});

export const createRevealedCoordinateWithoutBombs = (coordinate: Coordinate): BoardCoordinateWithNoBombNear => ({
    type: "REVEALED_WITH_NO_BOMB_NEAR",
    coordinate: coordinate
});

export const createRevealedCoordinateWithBombs = (coordinate: Coordinate, bombCount: number): BoardCoordinateRevealedWithBombNear => ({
    type: 'REVEALED_WITH_BOMB_NEAR',
    coordinate: coordinate,
    bombCount
});