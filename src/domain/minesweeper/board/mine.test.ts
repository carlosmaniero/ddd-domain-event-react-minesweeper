import {mineCreatorFactory, MineType} from "./mine";
import {Coordinate} from "../../coordinate/coordinate";

describe('mineFactoryCreator', () => {
    it('always returns a non mine for the initial coordinate', () => {
        const mineCreator = mineCreatorFactory(Coordinate.of({x: 0, y: 0}),0.1, () => 0.9);

        const mine = mineCreator(Coordinate.of({x: 0, y: 0}));
        expect(mine).toBe(MineType.NotMine);
    });

    it('always returns a non mine given the number is greater than the probability', () => {
        const mineCreator = mineCreatorFactory(Coordinate.of({x: 0, y: 0}),0.1, () => 0.11);

        const mine = mineCreator(Coordinate.of({x: 0, y: 1}));
        expect(mine).toBe(MineType.NotMine);
    });

    it('always returns a non mine for adjacents', () => {
        const mineCreator = mineCreatorFactory(Coordinate.of({x: 2, y: 2}),1, () => 0.11);

        expect(mineCreator(Coordinate.of({x: 1, y: 1}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 2, y: 1}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 3, y: 1}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 2, y: 1}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 2, y: 2}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 2, y: 3}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 3, y: 1}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 3, y: 2}))).toBe(MineType.NotMine);
        expect(mineCreator(Coordinate.of({x: 3, y: 3}))).toBe(MineType.NotMine);

    });

    it('always returns true given the value is equal the probability', () => {
        const mineCreator = mineCreatorFactory(Coordinate.of({x: 0, y: 0}),0.1, () => 0.1);

        const mine = mineCreator(Coordinate.of({x: 4, y: 4}));
        expect(mine).toBe(MineType.Mine);
    });
});