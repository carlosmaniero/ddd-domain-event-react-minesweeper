import {GameBoard} from "./gameBoard";
import {MineType} from "./mine";
import {RevealedBoard} from "./RevealedBoard";
import {Position} from "../position/position";

describe('RevealedBoard', () => {
    it('auto discover non bomb positions', () => {
        const board = new GameBoard([
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine]
        ]);

        const revealBoard = new RevealedBoard();
        const afterRevealAll = revealBoard.reveal(Position.of({x: 0, y: 0}), board);

        expect(afterRevealAll.hasUnrevealedBombs(board)).toBeFalsy();
    });
});