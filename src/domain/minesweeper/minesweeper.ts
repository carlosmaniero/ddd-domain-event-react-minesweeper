import {Event, eventCreator, EventPublisher} from "../events/events";
import {Coordinate} from '../coordinate/coordinate'
import {mineCreatorFactory, MineFactory} from "./field/mine";
import {createGameBoard, Field} from "./field/field";
import {GameLevelSettings, gameLevelSettings} from "../settings";
import {CleanedBoard} from "./field/CleanedBoard";
import {GameLevel} from "./gameLevel";

enum MinesweeperState {
    NotStarted,
    Started,
    Finished,
    GameOver
}

export class Minesweeper {
    static events = {
        created: eventCreator<Minesweeper>('MINESWEEPER_CREATED'),
        started: eventCreator<Minesweeper>('MINESWEEPER_STARTED'),
        revealed: eventCreator<Minesweeper>('MINESWEEPER_REVEALED'),
        gameOver: eventCreator<Minesweeper>('MINESWEEPER_OVER'),
        finished: eventCreator<Minesweeper>('MINESWEEPER_FINISHED')
    };

    private readonly gameLevelSettings: GameLevelSettings;

    constructor(private readonly eventPublisher: EventPublisher,
                private readonly mineFactory: MineFactory,
                public readonly gameLevel: GameLevel,
                private readonly cleanedBoard: CleanedBoard = new CleanedBoard(),
                private readonly field?: Field,
                private readonly state: MinesweeperState = MinesweeperState.NotStarted) {
        this.gameLevelSettings = gameLevelSettings(gameLevel);
        this.gameLevel = gameLevel;
    }

    public boardSize() {
        return this.gameLevelSettings.boardSize;
    }
    public sweep(coordinate: Coordinate): Minesweeper {
        if (this.bombExploded() || this.completelyCleaned()) {
            return this;
        }

        if (!this.field) {
            return this.startGame(coordinate);
        }

        if (this.field.isBomb(coordinate)) {
            return this.explodeBomb();
        }

        return this.sweepCoordinate(coordinate, this.field);
    }

    private sweepCoordinate(coordinate: Coordinate, board: Field) {
        const revealedBoard = this.cleanedBoard.clean(coordinate, board);

        let reveledGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            revealedBoard,
            board,
            this.stateFrom(revealedBoard)
        );

        if (reveledGame.completelyCleaned()) {
            this.publishEvent(Minesweeper.events.finished(reveledGame));
        } else {
            this.publishEvent(Minesweeper.events.revealed(reveledGame));
        }

        return reveledGame;
    }

    private stateFrom(revealedBoard: CleanedBoard) {
        if (!this.field || revealedBoard.hasUnrevealedBombs(this.field)) {
            return this.state;
        }

        return MinesweeperState.Finished;
    }

    public bombCount(coordinate: Coordinate) {
        if (!this.field) {
            return 0;
        }
        return this.field.nearBombCount(coordinate);
    }

    public hasBombNear(coordinate: Coordinate) {
        return this.field && this.field.hasBombNear(coordinate);
    }

    public isCleaned(coordinate: Coordinate) {
        return this.field && this.cleanedBoard.isRevealed(coordinate);
    }

    private startGame(coordinate: Coordinate) {
        const board = this.createBoard(coordinate);

        const startedGame = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.cleanedBoard.clean(coordinate, board),
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

    private explodeBomb() {
        const gameOverMinesweeper = new Minesweeper(
            this.eventPublisher,
            this.mineFactory,
            this.gameLevel,
            this.cleanedBoard,
            this.field,
            MinesweeperState.GameOver
        );

        this.publishEvent(Minesweeper.events.gameOver(gameOverMinesweeper));
        return gameOverMinesweeper;
    }

    public bombExploded(): boolean {
        return this.state === MinesweeperState.GameOver;
    }

    public completelyCleaned() {
        return this.state === MinesweeperState.Finished;
    }
}

export type MinesweeperCreator = (gameLevel: GameLevel) => Minesweeper;

export const minesweeperFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): MinesweeperCreator => (gameLevel: GameLevel) =>
    new Minesweeper(eventPublisher, mineFactory, gameLevel);
