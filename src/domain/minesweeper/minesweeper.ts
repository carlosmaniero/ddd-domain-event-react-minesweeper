import {Event, eventCreator, EventPublisher} from "../events/events";
import {Coordinate} from '../coordinate/coordinate'
import {mineCreatorFactory, MineFactory} from "./board/mine";
import {createGameBoard, GameBoard} from "./board/gameBoard";
import {GameLevelSettings, gameLevelSettings} from "../settings";
import {RevealedBoard} from "./board/RevealedBoard";
import {
    BoardCoordinate,
    createNotRevealedCoordinate,
    createRevealedCoordinateWithBombs,
    createRevealedCoordinateWithoutBombs
} from "../coordinate/boardCoordinate";
import {GameLevel} from "./gameLevel";

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

    public boardCoordinates(): BoardCoordinate[] {
        return range(this.boardTotalCoordinates())
            .map((index) => this.coordinateFromIndex(index))
            .map((coordinate) => this.boardCoordinate(coordinate));
    }

    public revealCoordinate(coordinate: Coordinate): Minesweeper {
        if (this.isGameOver() || this.isFinished()) {
            return this;
        }

        if (!this.board) {
            return this.startGame(coordinate);
        }

        if (this.board.isBomb(coordinate)) {
            return this.gameOver();
        }

        return this.handleRevelCoordinate(coordinate, this.board);
    }

    private handleRevelCoordinate(coordinate: Coordinate, board: GameBoard) {
        const revealedBoard = this.revealedBoard.reveal(coordinate, board);

        let reveledGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            revealedBoard,
            board,
            this.stateFrom(revealedBoard)
        );

        if (reveledGame.isFinished()) {
            this.publishEvent(Minesweeper.events.finished(reveledGame));
        } else {
            this.publishEvent(Minesweeper.events.revealed(reveledGame));
        }

        return reveledGame;
    }

    private stateFrom(revealedBoard: RevealedBoard) {
        if (!this.board || revealedBoard.hasUnrevealedBombs(this.board)) {
            return this.state;
        }

        return MinesweeperState.Finished;
    }

    private boardTotalCoordinates() {
        return this.boardSize().width * this.boardSize().height;
    }

    private boardCoordinate(coordinate: Coordinate): BoardCoordinate {
        if (!this.revealedBoard.isRevealed(coordinate) || !this.board) {
            return createNotRevealedCoordinate(coordinate);
        }

        if (this.board.hasBombNear(coordinate)) {
            return createRevealedCoordinateWithBombs(coordinate, this.board.nearBombCount(coordinate));
        }

        return createRevealedCoordinateWithoutBombs(coordinate);
    }

    private coordinateFromIndex(index: number) {
        return Coordinate.of({
            x: index % this.boardSize().width,
            y: Math.trunc(index / this.boardSize().width)
        });
    }

    private startGame(coordinate: Coordinate) {
        const board = this.createBoard(coordinate);

        const startedGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.revealedBoard.reveal(coordinate, board),
            board,
            MinesweeperState.Started
        );

        this.publishEvent(Minesweeper.events.started(startedGame));
        return startedGame;
    }

    private createBoard(coordinate: Coordinate) {
        const mineCreator = this.mineFactory(coordinate, this.gameLevelSettings.mineProbability);
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
