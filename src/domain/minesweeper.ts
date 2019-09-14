import {Event, eventCreator, EventPublisher} from "./events/events";
import {Position} from './position/position'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {createGameBoard, GameBoard} from "./board/gameBoard";
import {GameLevelSettings, gameLevelSettings} from "./settings";
import {RevealedBoard} from "./board/RevealedBoard";
import {
    BoardPosition, createNotRevealedPosition,
    createRevealedPositionWithBombs,
    createRevealedPositionWithoutBombs
} from "./position/boardPosition";

export enum GameLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export const getAllGameLevels = () => Object.values(GameLevel);

const range = (size: number) => Array.from({length: size}, (_, index) => index);

export class Minesweeper {
    static events = {
        created: eventCreator<Minesweeper>('GAME_CREATED'),
        started: eventCreator<Minesweeper>('GAME_STARTED'),
        revealed: eventCreator<Minesweeper>('GAME_REVEALED')
    };

    private readonly gameLevelSettings: GameLevelSettings;

    constructor(private readonly eventPublisher: EventPublisher,
                private readonly mineFactory: MineFactory,
                public readonly gameLevel: GameLevel,
                private readonly revealedBoard: RevealedBoard = new RevealedBoard(),
                public board?: GameBoard) {
        this.gameLevelSettings = gameLevelSettings(gameLevel);

        if (!this.isStarted()) {
            this.publishEvent(Minesweeper.events.created(this));
        }
    }

    public boardSize() {
        return this.gameLevelSettings.boardSize;
    }

    public boardTotalPositions() {
        return this.boardSize().width * this.boardSize().height;
    }

    public boardPositions(): BoardPosition[] {
        return range(this.boardTotalPositions())
            .map((index) => this.positionFromIndex(index))
            .map((position) => this.boardPosition(position));
    }

    public revealPosition(position: Position): Minesweeper {
        if (!this.isStarted()) {
            return this.startGame(position);
        }

        const reveledGame = new Minesweeper(
            this.eventPublisher, this.mineFactory, this.gameLevel, this.revealedBoard.reveal(position), this.board);

        this.publishEvent(Minesweeper.events.revealed(reveledGame));
        return reveledGame;
    }

    private boardPosition(position: Position): BoardPosition {
        if (!this.revealedBoard.isRevealed(position) || !this.board) {
            return createNotRevealedPosition(position);
        }

        if (this.board.hasBombNear(position)) {
            return createRevealedPositionWithBombs(position, this.board.nearBombCount(position));
        }

        return createRevealedPositionWithoutBombs(position);
    }

    private positionFromIndex(index: number) {
        return Position.of({
            x: index % this.boardSize().width,
            y: Math.trunc(index / this.boardSize().width)
        });
    }

    private startGame(position: Position) {
        const board = this.createBoard(position);

        const startedGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.revealedBoard.reveal(position),
            board
        );

        this.publishEvent(Minesweeper.events.started(startedGame));
        return startedGame;
    }

    private createBoard(position: Position) {
        const mineCreator = this.mineFactory(position, this.gameLevelSettings.mineProbability);
        return createGameBoard(mineCreator)(this.boardSize());
    }

    private publishEvent(event: Event<Minesweeper>) {
        this.eventPublisher.publish(event);
    }

    private isStarted() {
        return !!this.board;
    }
}

type MinesweeperConstructor = {
    eventPublisher: EventPublisher,
    mineFactory: MineFactory,
    gameLevel: GameLevel,
    revealedBoard: RevealedBoard,
    board?: GameBoard
};

export type GameCreator = (gameLevel: GameLevel) => Minesweeper;

export const gameFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): GameCreator => (gameLevel: GameLevel) =>
    new Minesweeper(eventPublisher, mineFactory, gameLevel);
