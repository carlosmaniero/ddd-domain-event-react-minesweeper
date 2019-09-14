import {Position} from "../position/position";
import {GameBoard} from "./gameBoard";

export class RevealedBoard {
    constructor(readonly revealedPositions: Array<Position> = []) {}

    public reveal(position: Position) {
        const revealedPositions = this.isRevealed(position)
            ? this.revealedPositions
            : [...this.revealedPositions, position];

        return new RevealedBoard(revealedPositions)
    }

    public isRevealed(position: Position) {
        return this.revealedPositions.some(revealedPosition => revealedPosition.sameOf(position));
    }

    public hasUnrevealedBombs(board: GameBoard) {
        return board.bombCount() < this.totalUnrevealed(board);
    }

    private totalUnrevealed(board: GameBoard) {
        return (board.getHeight() * board.getWidth()) - this.revealedPositions.length;
    }
}