import {Minesweeper} from "../../domain/minesweeper/minesweeper";
import {Coordinate} from "../../domain/coordinate/coordinate";
import {
    BoardCoordinate,
    createNotRevealedCoordinate,
    createRevealedCoordinateWithBombs, createRevealedCoordinateWithoutBombs
} from "./boardCoordinate";

const range = (size: number) => Array.from({length: size}, (_, index) => index);

export class FieldPresenter {
    constructor(private readonly minesweeper: Minesweeper) {

    }

    public boardCoordinates() {
        return range(this.boardTotalCoordinates())
            .map((index) => this.coordinateFromIndex(index))
            .map((coordinate) => this.boardCoordinate(coordinate));
    }

    private boardTotalCoordinates() {
        return this.minesweeper.boardSize().width * this.minesweeper.boardSize().height;
    }

    private coordinateFromIndex(index: number) {
        return Coordinate.of({
            x: index % this.minesweeper.boardSize().width,
            y: Math.trunc(index / this.minesweeper.boardSize().width)
        });
    }

    private boardCoordinate(coordinate: Coordinate): BoardCoordinate {
        if (!this.minesweeper.isCleaned(coordinate)) {
            return createNotRevealedCoordinate(coordinate);
        }

        if (this.minesweeper.hasBombNear(coordinate)) {
            return createRevealedCoordinateWithBombs(coordinate, this.minesweeper.bombCount(coordinate));
        }

        return createRevealedCoordinateWithoutBombs(coordinate);
    }
}