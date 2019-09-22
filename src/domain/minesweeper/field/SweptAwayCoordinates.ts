import {Coordinate} from "../../coordinate/coordinate";
import {Field} from "./field";

export class SweptAwayCoordinates {
    constructor(readonly revealedCoordinates: Coordinate[] = []) {}

    public sweep(coordinate: Coordinate, board: Field) {
        const revealedCoordinates = this.isRevealed(coordinate)
            ? this.revealedCoordinates
            : [...this.revealedCoordinates, coordinate];

        return new SweptAwayCoordinates(SweptAwayCoordinates.propagateSweep(revealedCoordinates, board))
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

    private static propagateSweep(sweptCoordinates: Coordinate[], field: Field): Coordinate[] {
        const wasSweep = (coordinate: Coordinate) => coordinate.isPresent(sweptCoordinates);

        const hasBombNear = (coordinate: Coordinate) =>
            coordinate.getAdjacent()
                .filter((adjacentCoordinate) => field.containsCoordinate(adjacentCoordinate))
                .filter((adjacentCoordinate) => adjacentCoordinate.isPresent(sweptCoordinates))
                .some((adjacentCoordinate) => !field.hasBombNear(adjacentCoordinate));

        const afterAutoSweepCoordinates = field.coordinates()
            .filter((coordinate: Coordinate) => wasSweep(coordinate) || hasBombNear(coordinate));

        if (afterAutoSweepCoordinates.length !== sweptCoordinates.length) {
            return SweptAwayCoordinates.propagateSweep(afterAutoSweepCoordinates, field);
        }

        return afterAutoSweepCoordinates;
    }
}