import {BoardSize} from "./board/gameBoard";
import {GameLevel} from "./game";

export interface GameLevelSettings {
    mineProbability: number;
    boardSize: BoardSize;
}

export const gameLevelSettings = (gameLevel: GameLevel): GameLevelSettings => {
    switch (gameLevel) {
        case GameLevel.EASY:
            return {
                mineProbability: 0.2,
                boardSize: {width: 6, height: 9}
            };
        case GameLevel.MEDIUM:
            return {
                mineProbability: 0.25,
                boardSize: {width: 9, height: 12}
            };
        case GameLevel.HARD:
            return {
                mineProbability: 0.30,
                boardSize: {width: 12, height: 15}
            };
    }
};