import {Position} from "../../position/position";
import {GameBoard} from "./gameBoard";

export class RevealedBoard {
    constructor(readonly revealedPositions: Array<Position> = []) {}

    public reveal(position: Position, board: GameBoard) {
        const revealedPositions = this.isRevealed(position)
            ? this.revealedPositions
            : [...this.revealedPositions, position];

        return new RevealedBoard(this.propagateReveal(revealedPositions, position, board, 5))
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

    private propagateReveal(revealedPositions: Position[], position: Position, board: GameBoard, depth: number): Position[] {
        if (depth === 0) {
            return revealedPositions;
        }
        if (board.hasBombNear(position)) {
            return revealedPositions;
        }

        const nonBombPositions: Position[] = position.getAdjacent()
            .filter((adjacentPosition) => board.containsPosition(adjacentPosition))
            .filter((adjacentPosition) => !board.isBomb(adjacentPosition));

        const nomBombNearPositions = nonBombPositions
            .filter((nonBombPosition) => !board.hasBombNear(nonBombPosition))
            .flatMap((nonBombPositions) => this.propagateReveal(revealedPositions, nonBombPositions, board, depth - 1));

        return [...revealedPositions, ...nonBombPositions, ...nomBombNearPositions]
            .reduce((positions: Position[], position: Position) =>
                position.isPresent(positions) ? positions : [...positions, position], []);
    }
}