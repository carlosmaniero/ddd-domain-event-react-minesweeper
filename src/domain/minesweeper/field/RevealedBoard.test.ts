import {Field} from "./field";
import {MineType} from "./mine";
import {CleanedBoard} from "./CleanedBoard";
import {Coordinate} from "../../coordinate/coordinate";

describe('RevealedBoard', () => {
    it('auto discover non bomb coordinate', () => {
        const board = new Field([
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine],
            [MineType.NotMine, MineType.NotMine, MineType.NotMine, MineType.NotMine]
        ]);

        const revealBoard = new CleanedBoard();
        const afterRevealAll = revealBoard.clean(Coordinate.of({x: 0, y: 0}), board);

        expect(afterRevealAll.hasUnrevealedBombs(board)).toBeFalsy();
    });
});