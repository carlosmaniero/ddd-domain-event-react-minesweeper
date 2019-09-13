import {mineCreatorFactory, MineType} from "./mine";
import {Position} from "../position/position";

describe('mineFactoryCreator', () => {
    it('always returns a non mine for the initial position', () => {
        const mineCreator = mineCreatorFactory(Position.of({x: 0, y: 0}),0.1, () => 0.9);

        const mine = mineCreator(Position.of({x: 0, y: 0}));
        expect(mine).toBe(MineType.NotMine);
    });

    it('always returns a non mine given the number is greater than the probability', () => {
        const mineCreator = mineCreatorFactory(Position.of({x: 0, y: 0}),0.1, () => 0.11);

        const mine = mineCreator(Position.of({x: 0, y: 1}));
        expect(mine).toBe(MineType.NotMine);
    });

    it('always returns true given the value is equal the probability', () => {
        const mineCreator = mineCreatorFactory(Position.of({x: 0, y: 0}),0.1, () => 0.1);

        const mine = mineCreator(Position.of({x: 1, y: 1}));
        expect(mine).toBe(MineType.Mine);
    });
});