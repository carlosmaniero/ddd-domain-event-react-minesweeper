export enum GameLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export const getAllGameLevels = () => Object.values(GameLevel);