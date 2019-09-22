import {MineCreator, MineType} from "./mine";
import {Coordinate} from "../../coordinate/coordinate";

export interface BoardSize {
    width: number;
    height: number;
}

export class Field {
    constructor(readonly board: MineType[][]) {
        this.board = board;
    }

    public nearBombCount(coordinate: Coordinate) {
        return this.getAdjacent(coordinate)
            .filter(mineType => mineType === MineType.Mine)
            .length;
    }

    public isBomb(coordinate: Coordinate) {
        return this.getByCoordinate(coordinate) === MineType.Mine;
    }

    public hasBombNear(coordinate: Coordinate) {
        return this.nearBombCount(coordinate) > 0;
    }

    public getWidth() {
        return this.board[0].length;
    }

    public getHeight() {
        return this.board.length;
    }

    public bombCount() {
        return this.board.flat()
            .filter(mineType => mineType === MineType.Mine)
            .length;
    }

    private getAdjacent(coordinate: Coordinate): MineType[] {
        return coordinate.getAdjacent()
            .map((coordinate) => this.getByCoordinate(coordinate));
    }

    private getByCoordinate(coordinate: Coordinate): MineType {
        let boardElement = this.board[coordinate.y];
        return boardElement ? boardElement[coordinate.x] : MineType.NotMine;
    }

    containsCoordinate(coordinate: Coordinate) {
        if (coordinate.y < 0 || coordinate.x < 0) {
            return false;
        }
        return coordinate.y < this.getHeight() && coordinate.x < this.getWidth();
    }
}

export type BoardCreator = (boardSize: BoardSize) => Field;

type BoardLineCreator = (line: number) => MineType[];

const range = (size: number) => Array.from({length: size}, (_, index) => index);

const boardLineCreatorFor = (mineCreator: MineCreator, width: number): BoardLineCreator => (line: number) =>
    range(width).map(column => mineCreator(Coordinate.of({x: column, y: line})));

const createBoard = (boardLineCreator: BoardLineCreator, height: number) =>
    range(height).map(boardLineCreator);

export const createGameBoard = (mineCreator: MineCreator): BoardCreator => (boardSize: BoardSize): Field =>
    new Field(createBoard(boardLineCreatorFor(mineCreator, boardSize.width), boardSize.height));