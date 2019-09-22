import React, {useContext, useEffect, useState} from 'react';
import './App.css';
import {Minesweeper} from "./domain/minesweeper/minesweeper";
import {EventHandlerContext} from "./view/components/eventHandler/eventHandlerContext";
import {LevelSelector} from "./view/components/levelSelector/LevelSelector";
import {CreateMinesweeperService} from "./domain/minesweeper/services/createMinesweeperService";
import {anyOf} from "./domain/events/events";
import {GameBoard} from "./view/components/board/GameBoard";
import {GameOver} from "./view/components/gameStatus/gameOver";
import {GameWin} from "./view/components/gameStatus/gameWin";

const App: React.FC = () => {
    const [minesweeper, setMinesweeper] = useState<Minesweeper>();
    const eventPublisher = useContext(EventHandlerContext);
    const createMinesweeperService = new CreateMinesweeperService(eventPublisher);

    useEffect(() => {
        const eventPublisherSubscriptionID = eventPublisher
            .listen(anyOf([
                Minesweeper.events.created,
                Minesweeper.events.started,
                Minesweeper.events.revealed,
                Minesweeper.events.gameOver,
                Minesweeper.events.finished
            ]), setMinesweeper);
        return () => eventPublisher.unsubscribe(eventPublisherSubscriptionID);
    }, [eventPublisher]);

    return (
        <div className="App">
            {!minesweeper && <LevelSelector onSelect={(gameLevel) => createMinesweeperService.create(gameLevel)}/>}
            {minesweeper && <GameBoard game={minesweeper} />}
            {minesweeper && minesweeper.bombExploded() && <GameOver />}
            {minesweeper && minesweeper.completelySweptAway() && <GameWin />}
        </div>
    );
};

export default App;
