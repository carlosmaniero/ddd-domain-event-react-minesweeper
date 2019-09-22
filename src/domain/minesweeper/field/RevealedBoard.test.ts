import {Field} from "./field";
import {MineType} from "./mine";
import {SweptAwayCoordinates} from "./SweptAwayCoordinates";
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

        const revealBoard = new SweptAwayCoordinates();
        const afterRevealAll = revealBoard.sweep(Coordinate.of({x: 0, y: 0}), board);

        expect(afterRevealAll.hasCoordinatesToBeSwept(board)).toBeFalsy();
    });
});