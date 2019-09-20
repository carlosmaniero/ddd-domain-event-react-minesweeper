import {EventPublisher} from "../../events/events";
import {GameLevel, Minesweeper, MinesweeperCreator, minesweeperFactory} from "../minesweeper";

export class CreateMinesweeperService {
    private readonly minesweeperFactory: MinesweeperCreator;

    constructor(private readonly eventPublisher: EventPublisher) {
        this.minesweeperFactory = minesweeperFactory(this.eventPublisher);
    }

    public create(gameLevel: GameLevel) {
        const game = this.minesweeperFactory(gameLevel);
        this.eventPublisher.publish(Minesweeper.events.created(game))
    }
}