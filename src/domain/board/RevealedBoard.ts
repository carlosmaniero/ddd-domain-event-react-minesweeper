import {Position} from "../position/position";

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
}