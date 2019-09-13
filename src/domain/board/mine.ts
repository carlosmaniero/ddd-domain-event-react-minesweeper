import {Position} from '../position/position';

export enum MineType {
    Mine = 'Mine',
    NotMine = 'NotMine'
}

type NumberGenerator = () => number;

export type MineCreator = (position: Position) => MineType;
export type MineFactory = (initialPosition: Position, probability: number, numberGenerator?: NumberGenerator) => MineCreator

export const mineCreatorFactory: MineFactory = (initialPosition: Position, probability: number, numberGenerator: NumberGenerator = Math.random): MineCreator => {
    const isInitialPosition = (position: Position) => position.x === initialPosition.x && position.y === initialPosition.y;
    const attendToProbability = () => numberGenerator() <= probability;
    const isMine = (position: Position) => !isInitialPosition(position) && attendToProbability();

    return (position: Position) => isMine(position) ? MineType.Mine : MineType.NotMine;
};