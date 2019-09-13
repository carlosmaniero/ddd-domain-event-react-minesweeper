import {Event, eventCreator, EventPublisher} from "./events/events";
import {Position} from './position/position'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {createGameBoard, GameBoard} from "./board/gameBoard";
import {GameLevelSettings, gameLevelSettings} from "./settings";
import {RevealedBoard} from "./board/RevealedBoard";

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

type BoardPositionWithNoBombNear = {
    type: 'REVEALED_WITH_NO_BOMB_NEAR',
    position: Position
};

export type BoardPosition =
    BoardPositionNotRevealed
    | BoardPositionRevealedWithBombNear
    | BoardPositionWithNoBombNear;


export const isRevealedWithNoBombNear = (boardPosition: BoardPosition): boardPosition is BoardPositionWithNoBombNear =>
    boardPosition.type === 'REVEALED_WITH_NO_BOMB_NEAR';

export const isRevealedWithBombsNear = (boardPosition: BoardPosition): boardPosition is BoardPositionRevealedWithBombNear =>
    boardPosition.type === 'REVEALED_WITH_BOMB_NEAR';

export const isRevealed = (boardPosition: BoardPosition) =>
    isRevealedWithBombsNear(boardPosition) || isRevealedWithNoBombNear(boardPosition)

export class Game {
    static events = {
        created: eventCreator<Game>('GAME_CREATED'),
        started: eventCreator<Game>('GAME_STARTED')
    };

    private readonly gameLevelSettings: GameLevelSettings;

    constructor(private readonly eventPublisher: EventPublisher,
                private readonly mineFactory: MineFactory,
                public readonly gameLevel: GameLevel,
                private readonly revealedBoard: RevealedBoard = new RevealedBoard(),
                public board?: GameBoard) {
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
            .map((index) => this.getBoardPositionForPositionIndex(index));
    }

    public revealPosition(position: Position): Game {
        return this.startGame(position);
    }

    private getBoardPositionForPositionIndex(index: number): BoardPosition {
        const position = Position.of({
            x: index % this.getBoardSize().width,
            y: Math.trunc(index / this.getBoardSize().width)
        });

        if (!this.revealedBoard.isRevealed(position) || !this.board) {
            return {
                type: 'NOT_REVEALED',
                position: position
            };
        }

        if (this.board.hasBomb(position)) {
            return {
                type: 'REVEALED_WITH_BOMB_NEAR',
                position: position,
                bombCount: this.board.bombCount(position)
            };
        }

        return {
            type: 'REVEALED_WITH_NO_BOMB_NEAR',
            position: position,
        };
    }

    private startGame(position: Position) {
        const board = this.createBoard(position);

        const startedGame = new Game(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.revealedBoard.reveal(position),
            board
        );

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