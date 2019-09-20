import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {Minesweeper} from "./domain/minesweeper/minesweeper";
import {EventHandlerContext} from "./components/eventHandler/eventHandlerContext";
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {CreateMinesweeperService} from "./domain/minesweeper/services/createMinesweeperService";
import {Event, EventChecker} from "./domain/events/events";
import {GameBoard} from "./components/board/GameBoard";

const App: React.FC = () => {
    const [game, setGame] = useState<Minesweeper>();
    const eventPublisher = useContext(EventHandlerContext);
    const createMinesweeperService = new CreateMinesweeperService(eventPublisher);

    useEffect(() => {
        const eventChecker: EventChecker<Minesweeper> = {
            isTypeOf: (event): event is Event<Minesweeper> =>
                Minesweeper.events.created.isTypeOf(event)
                || Minesweeper.events.started.isTypeOf(event)
                || Minesweeper.events.revealed.isTypeOf(event)
        };

        const eventPublisherSubscriptionID = eventPublisher.listen(eventChecker, setGame);

        return () => eventPublisher.unsubscribe(eventPublisherSubscriptionID);
    }, [eventPublisher]);

    return (
        <div className="App">
            {!game && <LevelSelector onSelect={(gameLevel) => createMinesweeperService.create(gameLevel)}/>}
            {game && <GameBoard game={game} />}
        </div>
    );
};

export default App;
