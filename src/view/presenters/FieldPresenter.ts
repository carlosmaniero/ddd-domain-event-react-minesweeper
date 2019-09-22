import {Minesweeper} from "../../domain/minesweeper/minesweeper";
import {Coordinate} from "../../domain/coordinate/coordinate";
import {
    BoardCoordinate, createFlaggedCoordinate,
    createNotRevealedCoordinate,
    createRevealedCoordinateWithBombs, createRevealedCoordinateWithoutBombs
} from "./boardCoordinate";
import {MineIndicator} from "../../domain/mineIndicator/MineIndicator";

const range = (size: number) => Array.from({length: size}, (_, index) => index);

export class FieldPresenter {
    constructor(
        private readonly minesweeper: Minesweeper,
        private readonly mineIndicator?: MineIndicator
    ) { }

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
        if (this.mineIndicator && this.mineIndicator.isFlagged(coordinate)) {
            return createFlaggedCoordinate(coordinate)
        }

        if (!this.minesweeper.isSwept(coordinate)) {
            return createNotRevealedCoordinate(coordinate);
        }

        if (this.minesweeper.hasBombNear(coordinate)) {
            return createRevealedCoordinateWithBombs(coordinate, this.minesweeper.bombCount(coordinate));
        }

        return createRevealedCoordinateWithoutBombs(coordinate);
    }
}