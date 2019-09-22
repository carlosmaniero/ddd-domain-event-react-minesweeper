import {Coordinate} from "../../coordinate/coordinate";
import {Field} from "./field";

export class SweptAwayCoordinates {
    constructor(readonly revealedCoordinates: Coordinate[] = []) {}

    public sweep(coordinate: Coordinate, board: Field) {
        const revealedCoordinates = this.isRevealed(coordinate)
            ? this.revealedCoordinates
            : [...this.revealedCoordinates, coordinate];

        return new SweptAwayCoordinates(this.propagateReveal(revealedCoordinates, coordinate, board, 5))
    }

    public isRevealed(coordinate: Coordinate) {
        return this.revealedCoordinates.some(revealedCoordinate => revealedCoordinate.sameOf(coordinate));
    }

    public hasCoordinatesToBeSwept(board: Field) {
        return board.bombCount() < this.totalToSweep(board);
    }

    private totalToSweep(board: Field) {
        return (board.getHeight() * board.getWidth()) - this.revealedCoordinates.length;
    }

    private propagateReveal(revealedCoordinate: Coordinate[], coordinate: Coordinate, board: Field, depth: number): Coordinate[] {
        if (depth === 0) {
            return revealedCoordinate;
        }
        if (board.hasBombNear(coordinate)) {
            return revealedCoordinate;
        }

        const nonBombCoordinates: Coordinate[] = coordinate.getAdjacent()
            .filter((adjacentCoordinate) => board.containsCoordinate(adjacentCoordinate))
            .filter((adjacentCoordinate) => !board.isBomb(adjacentCoordinate));

        const nomBombNearCoordinates = nonBombCoordinates
            .filter((nonBombCoordinate) => !board.hasBombNear(nonBombCoordinate))
            .flatMap((nonBombCoordinates) => this.propagateReveal(revealedCoordinate, nonBombCoordinates, board, depth - 1));

        return [...revealedCoordinate, ...nonBombCoordinates, ...nomBombNearCoordinates]
            .reduce((coordinates: Coordinate[], coordinate: Coordinate) =>
                coordinate.isPresent(coordinates) ? coordinates : [...coordinates, coordinate], []);
    }
}