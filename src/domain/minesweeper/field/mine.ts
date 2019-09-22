import {Coordinate} from '../../coordinate/coordinate';

export enum MineType {
    Mine = 'Mine',
    NotMine = 'NotMine'
}

type NumberGenerator = () => number;

export type MineCreator = (coordinate: Coordinate) => MineType;
export type MineFactory = (initialCoordinate: Coordinate, probability: number, numberGenerator?: NumberGenerator) => MineCreator

export const mineCreatorFactory: MineFactory = (initialCoordinate: Coordinate, probability: number, numberGenerator: NumberGenerator = Math.random): MineCreator => {
    const isInitialCoordinate = (coordinate: Coordinate) => coordinate.sameOf(initialCoordinate);
    const isAdjacent = (coordinate: Coordinate) => coordinate.isAdjacentOf(initialCoordinate);
    const attendToProbability = () => numberGenerator() <= probability;
    const isMine = (coordinate: Coordinate) => !isInitialCoordinate(coordinate) && !isAdjacent(coordinate) && attendToProbability();

    return (coordinate: Coordinate) => isMine(coordinate) ? MineType.Mine : MineType.NotMine;
};