import {eventCreator, EventPublisher} from "../events/events";
import {Position} from "../position/position";

export class MineIndicator {
    static events = {
        flagAdded: eventCreator<MineIndicator>('MINE_INDICATOR_ADDED'),
        flagRemoved: eventCreator<MineIndicator>('MINE_INDICATOR_REMOVED')
    };

    public constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly positions: Position[] = []
    ) {}

    public toggleFlag(position: Position) {
        if (this.isFlagged(position)) {
            return this.removeFlag(position);
        }
        return this.addFlag(position);
    }

    private addFlag(position: Position) {
        const positions = [...this.positions, position];
        const newMineIndicator = new MineIndicator(this.eventPublisher, positions);

        this.eventPublisher.publish(MineIndicator.events.flagAdded(newMineIndicator));
        return newMineIndicator;
    }

    private removeFlag(position: Position) {
        const positions = this.positions.filter((addedPosition) => !addedPosition.sameOf(position));
        const newMineIndicator = new MineIndicator(this.eventPublisher, positions);

        this.eventPublisher.publish(MineIndicator.events.flagRemoved(newMineIndicator));
        return newMineIndicator;
    }

    public isFlagged(position: Position) {
        return this.positions.some((addedPosition) => addedPosition.sameOf(position));
    }
}