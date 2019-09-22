import {Event, eventCreator, EventPublisher} from "../events/events";
import {Coordinate} from '../coordinate/coordinate'
import {mineCreatorFactory, MineFactory} from "./field/mine";
import {createGameBoard, Field} from "./field/field";
import {GameLevelSettings, gameLevelSettings} from "../settings";
import {SweptAwayCoordinates} from "./field/SweptAwayCoordinates";
import {GameLevel} from "./gameLevel";

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
                private sweptAwayCoordinates: SweptAwayCoordinates = new SweptAwayCoordinates(),
                private field?: Field,
                private hasBombExploded: boolean = false) {
        this.gameLevelSettings = gameLevelSettings(gameLevel);
        this.gameLevel = gameLevel;
    }

    public boardSize() {
        return this.gameLevelSettings.boardSize;
    }

    public sweep(coordinate: Coordinate) {
        if (this.isSweeperDead() || this.completelySweptAway()) {
            return;
        }

        if (!this.field) {
            this.startGame(coordinate);
            return;
        }

        if (this.field.isBomb(coordinate)) {
            this.explodeBomb();
            return;
        }

        this.sweepCoordinate(coordinate, this.field);
    }

    private sweepCoordinate(coordinate: Coordinate, field: Field) {
        this.sweptAwayCoordinates = this.sweptAwayCoordinates.sweep(coordinate, field);
        this.field = field;

        if (this.completelySweptAway()) {
            this.publishEvent(Minesweeper.events.finished(this));
        } else {
            this.publishEvent(Minesweeper.events.revealed(this));
        }
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

    public isSwept(coordinate: Coordinate) {
        return this.field && this.sweptAwayCoordinates.isRevealed(coordinate);
    }

    public isSweeperDead(): boolean {
        return this.hasBombExploded;
    }

    public completelySweptAway() {
        return this.field && !this.sweptAwayCoordinates.hasCoordinatesToBeSwept(this.field);
    }

    private startGame(coordinate: Coordinate) {
        this.field = this.createBoard(coordinate);
        this.sweptAwayCoordinates = this.sweptAwayCoordinates.sweep(coordinate, this.field);

        this.publishEvent(Minesweeper.events.started(this));
    }

    private createBoard(coordinate: Coordinate) {
        const mineCreator = this.mineFactory(coordinate, this.gameLevelSettings.mineProbability);
        return createGameBoard(mineCreator)(this.boardSize());
    }

    private publishEvent(event: Event<Minesweeper>) {
        this.eventPublisher.publish(event);
    }

    private explodeBomb() {
        this.hasBombExploded = true;
        this.publishEvent(Minesweeper.events.gameOver(this));
    }
}

export type MinesweeperCreator = (gameLevel: GameLevel) => Minesweeper;

export const minesweeperFactory = (eventPublisher: EventPublisher, mineFactory: MineFactory = mineCreatorFactory): MinesweeperCreator => (gameLevel: GameLevel) =>
    new Minesweeper(eventPublisher, mineFactory, gameLevel);
