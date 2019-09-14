import {MineCreator, MineType} from "./mine";
import {Position} from "../position/position";

export interface BoardSize {
    width: number;
    height: number;
}

export class GameBoard {
    constructor(readonly board: MineType[][]) {
        this.board = board;
    }

    public nearBombCount(position: Position) {
        return this.getAdjacent(position)
            .filter(mineType => mineType === MineType.Mine)
            .length;
    }

    public isBomb(position: Position) {
        return this.getByPosition(position) === MineType.Mine;
    }

    public hasBombNear(position: Position) {
        return this.nearBombCount(position) > 0;
    }

    public getWidth() {
        return this.board[0].length;
    }

    public getHeight() {
        return this.board.length;
    }

    private getAdjacent(position: Position): MineType[] {
        return position.getAdjacent()
            .map((position) => this.getByPosition(position));
    }

    private getByPosition(position: Position): MineType {
        let boardElement = this.board[position.y];
        return boardElement ? boardElement[position.x] : MineType.NotMine;
    }
}

export type BoardCreator = (boardSize: BoardSize) => GameBoard;

type BoardLineCreator = (line: number) => MineType[];

const range = (size: number) => Array.from({length: size}, (_, index) => index);

const boardLineCreatorFor = (mineCreator: MineCreator, width: number): BoardLineCreator => (line: number) =>
    range(width).map(column => mineCreator(Position.of({x: column, y: line})));

const createBoard = (boardLineCreator: BoardLineCreator, height: number) =>
    range(height).map(boardLineCreator);

export const createGameBoard = (mineCreator: MineCreator): BoardCreator => (boardSize: BoardSize): GameBoard =>
    new GameBoard(createBoard(boardLineCreatorFor(mineCreator, boardSize.width), boardSize.height));