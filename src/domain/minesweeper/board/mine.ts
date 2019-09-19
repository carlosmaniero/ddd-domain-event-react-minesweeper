import {Position} from '../../position/position';

export enum MineType {
    Mine = 'Mine',
    NotMine = 'NotMine'
}

type NumberGenerator = () => number;

export type MineCreator = (position: Position) => MineType;
export type MineFactory = (initialPosition: Position, probability: number, numberGenerator?: NumberGenerator) => MineCreator

export const mineCreatorFactory: MineFactory = (initialPosition: Position, probability: number, numberGenerator: NumberGenerator = Math.random): MineCreator => {
    const isInitialPosition = (position: Position) => position.sameOf(initialPosition);
    const isAdjacent = (position: Position) => position.isAdjacentOf(initialPosition);
    const attendToProbability = () => numberGenerator() <= probability;
    const isMine = (position: Position) => !isInitialPosition(position) && !isAdjacent(position) && attendToProbability();

    return (position: Position) => isMine(position) ? MineType.Mine : MineType.NotMine;
};