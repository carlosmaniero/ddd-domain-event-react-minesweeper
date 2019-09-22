import {minesweeperFactory, Minesweeper} from "./minesweeper";
import {Coordinate} from "../coordinate/coordinate";
import {MineType} from "./field/mine";
import {GameLevel} from "./gameLevel";

describe('minesweeper', () => {
    const createminesweeperWithMockedDependencies = () => {
        let mineFactory = jest.fn();
        let publisher = jest.fn();

        return {
            mineFactory,
            publisher,
            createMinesweeper: minesweeperFactory({publish: publisher}, mineFactory),
        }
    };

    describe('starting minesweeper', () => {
        it('publish an event with a started minesweeper', () => {
            const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
            mineFactory.mockReturnValue(() => MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);
            minesweeper.sweep(Coordinate.of({x: 0, y: 0}));

            expect(publisher).toBeCalledTimes(1);
            expect(publisher).toBeCalledWith(Minesweeper.events.started(minesweeper));
        });

        describe('minesweeper Level', () => {
            it.each`
                probability | level
                ${0.2} | ${GameLevel.EASY}
                ${0.2} | ${GameLevel.MEDIUM}
                ${0.17} | ${GameLevel.HARD}
            `('mine factory probability is $probability for $level', ({probability, level}) => {
                const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const minesweeper = createMinesweeper(level);
                const initialCoordinate = Coordinate.of({x: 0, y: 0});

                minesweeper.sweep(initialCoordinate);

                expect(mineFactory).toBeCalledWith(initialCoordinate, probability);
            });

            it.each`
                width | height | level
                ${6} | ${9} | ${GameLevel.EASY}
                ${9} | ${12} | ${GameLevel.MEDIUM}
                ${12} | ${15} | ${GameLevel.HARD}
            `('board size is $width x $height for $level', ({width, height, level}) => {
                const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const minesweeper = createMinesweeper(level);
                const initialCoordinate = Coordinate.of({x: 0, y: 0});

                minesweeper.sweep(initialCoordinate);

                expect(minesweeper.boardSize().width).toEqual(width);
                expect(minesweeper.boardSize().height).toEqual(height);
            });
        });
    });

    describe('revealing a coordinate', () => {
        describe('with a not started minesweeper', () => {
            it('Revel a coordinate with no mine near', () => {
                const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const revealedCoordinate = Coordinate.of({x: 1, y: 2});
                const minesweeper = createMinesweeper(GameLevel.EASY);
                minesweeper.sweep(revealedCoordinate);

                expect(minesweeper.isSwept(revealedCoordinate)).toBeTruthy();
            });

            it('revel a coordinate with mine near', () => {
                const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.Mine);

                const revealedCoordinate = Coordinate.of({x: 1, y: 2});
                const minesweeper = createMinesweeper(GameLevel.EASY);
                minesweeper.sweep(revealedCoordinate);

                expect(minesweeper.isSwept(revealedCoordinate)).toBeTruthy();
                expect(minesweeper.hasBombNear(revealedCoordinate)).toBeTruthy();
                expect(minesweeper.bombCount(revealedCoordinate)).toEqual(8);
            });
        });

        describe('with a started minesweeper', () => {
            it('publish an event when a coordinate is revealed', () => {
                const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

                const initialCoordinate = Coordinate.of({x: 0, y: 0});
                const revealCoordinate = Coordinate.of({x: 1, y: 1});
                const anyOtherCoordinate = Coordinate.of({x: 1, y: 2});

                mineFactory.mockReturnValue((coordinate: Coordinate) =>
                    coordinate.sameOf(initialCoordinate) || coordinate.sameOf(revealCoordinate) || coordinate.sameOf(anyOtherCoordinate)
                     ? MineType.NotMine
                     : MineType.Mine);

                const minesweeper = createMinesweeper(GameLevel.EASY);

                minesweeper.sweep(initialCoordinate);
                minesweeper.sweep(revealCoordinate);

                expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.revealed(minesweeper));
            });

            it('Revel a coordinate with no mine near', () => {
                const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();
                mineFactory.mockReturnValue(() => MineType.NotMine);

                const minesweeper = createMinesweeper(GameLevel.EASY);
                minesweeper.sweep(Coordinate.of({x: 1, y: 2}));
                minesweeper.sweep(Coordinate.of({x: 2, y: 2}));

                expect(minesweeper.hasBombNear(Coordinate.of({x: 2, y: 2}))).toBeFalsy();
                expect(minesweeper.isSwept(Coordinate.of({x: 2, y: 2}))).toBeTruthy();
            });
        });
    });

    describe('minesweeper over', () => {
        it('publish an event', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const anyOtherCoordinate = Coordinate.of({x: 5, y: 2});

            const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(anyOtherCoordinate)
                    ? MineType.NotMine : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);

            minesweeper.sweep(initialCoordinate);
            minesweeper.sweep(Coordinate.of({x: 1, y: 1}));

            expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.gameOver(minesweeper));
        });

        it('marks it self as minesweeper over', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const anyOtherCoordinate = Coordinate.of({x: 5, y: 2});

            const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(anyOtherCoordinate)
                    ? MineType.NotMine : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);
            minesweeper.sweep(initialCoordinate);

            expect(minesweeper.isSweeperDead()).toBeFalsy();

            minesweeper.sweep(Coordinate.of({x: 1, y: 1}));

            expect(minesweeper.isSweeperDead()).toBeTruthy();
        });

        it('prevents new reveals after a minesweeper over', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const afterminesweeperOverRevealCoordinate = Coordinate.of({x: 2, y: 2});

            const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(afterminesweeperOverRevealCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);
            minesweeper.sweep(initialCoordinate);
            minesweeper.sweep(Coordinate.of({x: 1, y: 1}));
            minesweeper.sweep(afterminesweeperOverRevealCoordinate);

            expect(publisher).toBeCalledTimes(2);
        });
    });

    describe('finishing the minesweeper', () => {
        it('publish an event', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);

            minesweeper.sweep(initialCoordinate);
            minesweeper.sweep(finishingCoordinate);

            expect(publisher).toHaveBeenNthCalledWith(2, Minesweeper.events.finished(minesweeper));
        });

        it('marks as finished', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);

            minesweeper.sweep(initialCoordinate);
            minesweeper.sweep(finishingCoordinate);

            expect(minesweeper.completelySweptAway()).toBeTruthy();
        });

        it('does not allows bomb reveal after minesweeper finishes', () => {
            const initialCoordinate = Coordinate.of({x: 0, y: 0});
            const finishingCoordinate = Coordinate.of({x: 1, y: 1});

            const {publisher, createMinesweeper, mineFactory} = createminesweeperWithMockedDependencies();

            mineFactory.mockReturnValue((coordinate: Coordinate) =>
                coordinate.sameOf(initialCoordinate) || coordinate.sameOf(finishingCoordinate)
                    ? MineType.NotMine
                    : MineType.Mine);

            const minesweeper = createMinesweeper(GameLevel.EASY);

            minesweeper.sweep(initialCoordinate);
            minesweeper.sweep(finishingCoordinate);
            minesweeper.sweep(Coordinate.of({x: 2, y: 2}));

            expect(publisher).toHaveBeenLastCalledWith(Minesweeper.events.finished(minesweeper));
        });
    });
});