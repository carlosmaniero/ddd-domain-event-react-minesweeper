import {EventPublisher} from "../events/events";
import {MineIndicator} from "./MineIndicator";

export class MineIndicatorService {
    constructor(private readonly eventPublisher: EventPublisher) { }

    public create() {
        const mineIndicator = new MineIndicator(this.eventPublisher);
        this.eventPublisher.publish(MineIndicator.events.created(mineIndicator));
    }
}