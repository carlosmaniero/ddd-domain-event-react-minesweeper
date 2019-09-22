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
import {MineIndicatorService} from "./domain/mineIndicator/MineIndicatorService";
import {MineIndicator} from "./domain/mineIndicator/MineIndicator";


const App: React.FC = () => {
    const [minesweeper, setMinesweeper] = useState<Minesweeper>();
    const [mineIndicator, setMineIndicator] = useState<MineIndicator>();

    const eventPublisher = useContext(EventHandlerContext);
    const createMinesweeperService = new CreateMinesweeperService(eventPublisher);
    const mineIndicatorService = new MineIndicatorService(eventPublisher);

    useEffect(() => {
        const minesweeperCreatedSubscriptionID = eventPublisher
            .listen(Minesweeper.events.created, () => mineIndicatorService.create());

        const mineIndicatorChangedSubscriptionId = eventPublisher
            .listen(anyOf([
                MineIndicator.events.created,
                MineIndicator.events.flagAdded,
                MineIndicator.events.flagRemoved
            ]), setMineIndicator);

        const minesweeperChangedSubscriptionID = eventPublisher
            .listen(anyOf([
                Minesweeper.events.created,
                Minesweeper.events.started,
                Minesweeper.events.revealed,
                Minesweeper.events.gameOver,
                Minesweeper.events.finished
            ]), setMinesweeper);

        return () => {
            eventPublisher.unsubscribe(minesweeperChangedSubscriptionID);
            eventPublisher.unsubscribe(minesweeperCreatedSubscriptionID);
            eventPublisher.unsubscribe(mineIndicatorChangedSubscriptionId);
        }
    }, [eventPublisher, mineIndicatorService, minesweeper]);

    return (
        <div className="App">
            {!minesweeper && <LevelSelector onSelect={(gameLevel) => createMinesweeperService.create(gameLevel)}/>}
            {minesweeper && mineIndicator && <GameBoard game={minesweeper} mineIndicator={mineIndicator} />}
            {minesweeper && minesweeper.isSweeperDead() && <GameOver />}
            {minesweeper && minesweeper.completelySweptAway() && <GameWin />}
        </div>
    );
};

export default App;
