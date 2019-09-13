import {Event, eventCreator, EventPublisher} from "./events/events";
import {Position} from './position/position'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {createGameBoard, GameBoard} from "./board/gameBoard";
import {GameLevelSettings, gameLevelSettings} from "./settings";

export enum GameLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export const getAllGameLevels = () => Object.values(GameLevel);

const range = (size: number) => Array.from({length: size}, (_, index) => index);

type BoardPositionNotRevealed = {
    type: 'NOT_REVEALED',
    position: Position
};

type BoardPositionRevealedWithBombNear = {
    type: 'REVEALED_WITH_BOMB_NEAR',
    bombCount: number,
    position: Position
};

type REVEALED_WITH_NO_BOMB_NEAR = {
    type: 'REVEALED_WITH_NO_BOMB_NEAR',
    position: Position
};

export type BoardPosition =
    BoardPositionNotRevealed
    | BoardPositionRevealedWithBombNear
    | REVEALED_WITH_NO_BOMB_NEAR;

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

    public getBoardSize() {
        return this.gameLevelSettings.boardSize;
    }

    public boardTotalPositions() {
        return this.getBoardSize().width * this.getBoardSize().height;
    }

    public boardPositions(): BoardPosition[] {
        return range(this.boardTotalPositions())
            .map((index) => this.getPositionForPositionIndex(index));
    }

    public revealPosition(position: Position): Game {
        return this.startGame(position);
    }

    private getPositionForPositionIndex(index: number): BoardPosition {
        return {
            type: 'NOT_REVEALED',
            position: Position.of({
                x: index % this.getBoardSize().width,
                y: Math.trunc(index / this.getBoardSize().width)
            })
        };
    }

    private startGame(position: Position) {
        const board = this.createBoard(position);
        const startedGame = new Game(this.eventPublisher, this.mineFactory, this.gameLevel, board);

        this.publishEvent(Game.events.started(startedGame));
        return startedGame;
    }

    private createBoard(position: Position) {
        const mineCreator = this.mineFactory(position, this.gameLevelSettings.mineProbability);
        return createGameBoard(mineCreator)(this.getBoardSize());
    }

    private publishEvent(event: Event<Game>) {
        this.eventPublisher.publish(event);
    }
}

export type GameCreator = (gameLevel: GameLevel) => Game;

export const gameFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): GameCreator => (gameLevel: GameLevel) =>
    new Game(eventPublisher, mineFactory, gameLevel);