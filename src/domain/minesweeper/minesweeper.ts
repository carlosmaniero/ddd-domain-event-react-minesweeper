import {Event, eventCreator, EventPublisher} from "../events/events";
import {Position} from '../position/position'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {createGameBoard, GameBoard} from "./board/gameBoard";
import {GameLevelSettings, gameLevelSettings} from "../settings";
import {RevealedBoard} from "./board/RevealedBoard";
import {
    BoardPosition,
    createNotRevealedPosition,
    createRevealedPositionWithBombs,
    createRevealedPositionWithoutBombs
} from "../position/boardPosition";

export enum GameLevel {
    EASY = 'Easy',
    MEDIUM = 'Medium',
    HARD = 'Hard',
}

export const getAllGameLevels = () => Object.values(GameLevel);

const range = (size: number) => Array.from({length: size}, (_, index) => index);

enum MinesweeperState {
    NotStarted,
    Started,
    Finished,
    GameOver
}

export class Minesweeper {
    static events = {
        created: eventCreator<Minesweeper>('GAME_CREATED'),
        started: eventCreator<Minesweeper>('GAME_STARTED'),
        revealed: eventCreator<Minesweeper>('GAME_REVEALED'),
        gameOver: eventCreator<Minesweeper>('GAME_OVER'),
        finished: eventCreator<Minesweeper>('GAME_FINISHED')
    };

    private readonly gameLevelSettings: GameLevelSettings;

    constructor(private readonly eventPublisher: EventPublisher,
                private readonly mineFactory: MineFactory,
                public readonly gameLevel: GameLevel,
                private readonly revealedBoard: RevealedBoard = new RevealedBoard(),
                private readonly board?: GameBoard,
                private readonly state: MinesweeperState = MinesweeperState.NotStarted) {
        this.gameLevelSettings = gameLevelSettings(gameLevel);
        this.gameLevel = gameLevel;
    }

    public boardSize() {
        return this.gameLevelSettings.boardSize;
    }

    private boardTotalPositions() {
        return this.boardSize().width * this.boardSize().height;
    }

    public boardPositions(): BoardPosition[] {
        return range(this.boardTotalPositions())
            .map((index) => this.positionFromIndex(index))
            .map((position) => this.boardPosition(position));
    }

    public revealPosition(position: Position): Minesweeper {
        if (this.isGameOver() || this.isFinished()) {
            return this;
        }

        if (!this.board) {
            return this.startGame(position);
        }

        if (this.board.isBomb(position)) {
            return this.gameOver();
        }

        const revealedBoard = this.revealedBoard.reveal(position, this.board);

        let reveledGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            revealedBoard,
            this.board,
            revealedBoard.hasUnrevealedBombs(this.board) ? this.state : MinesweeperState.Finished
        );

        if (reveledGame.isFinished()) {
            this.publishEvent(Minesweeper.events.finished(reveledGame));
        } else {
            this.publishEvent(Minesweeper.events.revealed(reveledGame));
        }
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
            this.revealedBoard.reveal(position, board),
            board,
            MinesweeperState.Started
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

    private gameOver() {
        const gameOverMinesweeper = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.revealedBoard,
            this.board,
            MinesweeperState.GameOver
        );

        this.publishEvent(Minesweeper.events.gameOver(gameOverMinesweeper));
        return gameOverMinesweeper;
    }

    isGameOver(): boolean {
        return this.state === MinesweeperState.GameOver;
    }

    isFinished() {
        return this.state === MinesweeperState.Finished;
    }
}

export type MinesweeperCreator = (gameLevel: GameLevel) => Minesweeper;

export const minesweeperFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): MinesweeperCreator => (gameLevel: GameLevel) =>
    new Minesweeper(eventPublisher, mineFactory, gameLevel);
