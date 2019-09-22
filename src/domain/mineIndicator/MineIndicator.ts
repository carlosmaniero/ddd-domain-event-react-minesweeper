import {eventCreator, EventPublisher} from "../events/events";
import {Coordinate} from "../coordinate/coordinate";

export class MineIndicator {
    static events = {
        created: eventCreator<MineIndicator>('MINE_INDICATOR_CREATED'),
        flagAdded: eventCreator<MineIndicator>('MINE_INDICATOR_ADDED'),
        flagRemoved: eventCreator<MineIndicator>('MINE_INDICATOR_REMOVED')
    };

    public constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly coordinates: Coordinate[] = []
    ) {}

    public toggleFlag(coordinate: Coordinate) {
        if (this.isFlagged(coordinate)) {
            return this.removeFlag(coordinate);
        }
        return this.addFlag(coordinate);
    }

    private addFlag(coordinate: Coordinate) {
        const coordinates = [...this.coordinates, coordinate];
        const newMineIndicator = new MineIndicator(this.eventPublisher, coordinates);

        this.eventPublisher.publish(MineIndicator.events.flagAdded(newMineIndicator));
        return newMineIndicator;
    }

    private removeFlag(coordinate: Coordinate) {
        const coordinates = this.coordinates.filter((addedCoordinate) => !addedCoordinate.sameOf(coordinate));
        const newMineIndicator = new MineIndicator(this.eventPublisher, coordinates);

        this.eventPublisher.publish(MineIndicator.events.flagRemoved(newMineIndicator));
        return newMineIndicator;
    }

    public isFlagged(coordinate: Coordinate) {
        return this.coordinates.some((addedCoordinate) => addedCoordinate.sameOf(coordinate));
    }
}