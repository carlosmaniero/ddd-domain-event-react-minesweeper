import {Position} from "./position";

type BoardPositionNotRevealed = {
    type: 'NOT_REVEALED',
    position: Position
};

type BoardPositionRevealedWithBombNear = {
    type: 'REVEALED_WITH_BOMB_NEAR',
    bombCount: number,
    position: Position
};

type BoardPositionWithNoBombNear = {
    type: 'REVEALED_WITH_NO_BOMB_NEAR',
    position: Position
};

export type BoardPosition =
    BoardPositionNotRevealed
    | BoardPositionRevealedWithBombNear
    | BoardPositionWithNoBombNear;

export const isRevealedWithNoBombNear = (boardPosition: BoardPosition): boardPosition is BoardPositionWithNoBombNear =>
    boardPosition.type === 'REVEALED_WITH_NO_BOMB_NEAR';

export const isRevealedWithBombsNear = (boardPosition: BoardPosition): boardPosition is BoardPositionRevealedWithBombNear =>
    boardPosition.type === 'REVEALED_WITH_BOMB_NEAR';

export const isRevealed = (boardPosition: BoardPosition) =>
    isRevealedWithBombsNear(boardPosition) || isRevealedWithNoBombNear(boardPosition);

export const createNotRevealedPosition = (position: Position): BoardPositionNotRevealed => ({
    type: "NOT_REVEALED",
    position
});

export const createRevealedPositionWithoutBombs = (position: Position): BoardPositionWithNoBombNear => ({
    type: "REVEALED_WITH_NO_BOMB_NEAR",
    position
});

export const createRevealedPositionWithBombs = (position: Position, bombCount: number): BoardPositionRevealedWithBombNear => ({
    type: 'REVEALED_WITH_BOMB_NEAR',
    position,
    bombCount
});