import {eventCreator, EventPublisher, Event} from "./events/events";
import {Position} from './position/position'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {BoardSize, createGameBoard, GameBoard} from "./board/gameBoard";

export enum GameLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export const getAllGameLevels = () => Object.values(GameLevel);

interface GameLevelSettings {
    mineProbability: number;
    boardSize: BoardSize;
}

const gameLevelSettings = (gameLevel: GameLevel): GameLevelSettings => {
    switch (gameLevel) {
        case GameLevel.EASY:
            return {
                mineProbability: 20,
                boardSize: {width: 6, height: 9}
            };
        case GameLevel.MEDIUM:
            return {
                mineProbability: 25,
                boardSize: {width: 9, height: 12}
            };
        case GameLevel.HARD:
            return {
                mineProbability: 30,
                boardSize: {width: 12, height: 15}
            };
    }
};

export class Game {
    static events = {
        created: eventCreator<Game>('GAME_CREATED'),
        started: eventCreator<Game>('GAME_STARTED')
    };

    private readonly eventPublisher: EventPublisher;
    private readonly mineFactory: MineFactory;
    public readonly gameLevel: GameLevel;
    private readonly gameLevelSettings: GameLevelSettings;
    public readonly board?: GameBoard;

    constructor(eventPublisher: EventPublisher, mineFactory: MineFactory,
                gameLevel: GameLevel, board?: GameBoard) {
        this.eventPublisher = eventPublisher;
        this.mineFactory = mineFactory;
        this.gameLevel = gameLevel;
        this.board = board;
        this.gameLevelSettings = gameLevelSettings(gameLevel);

        if (!this.board) {
            this.publishEvent(Game.events.created(this));
        }
    }

    public startGame(position: Position): Game {
        const board = this.createBoard(position);
        const startedGame = new Game(this.eventPublisher, this.mineFactory, this.gameLevel, board);

        this.publishEvent(Game.events.started(startedGame));
        return startedGame;
    }

    private createBoard(position: Position) {
        const mineCreator = this.mineFactory(position, this.gameLevelSettings.mineProbability);
        return createGameBoard(mineCreator)(this.gameLevelSettings.boardSize);
    }

    private publishEvent(event: Event<Game>) {
        this.eventPublisher.publish(event);
    }
}

export type GameCreator = (gameLevel: GameLevel) => Game;

export const gameFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): GameCreator => (gameLevel: GameLevel) =>
    new Game(eventPublisher, mineFactory, gameLevel);