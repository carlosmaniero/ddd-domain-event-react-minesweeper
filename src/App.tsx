import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {gameFactory, Minesweeper} from "./domain/minesweeper";
import {EventPublisher, eventPublisherBuilder} from "./domain/events/events";

const App: React.FC = () => {
    const [game, setGame] = useState<Minesweeper>();

    const eventPublisher: EventPublisher = eventPublisherBuilder()
        .listen(Minesweeper.events.created, setGame)
        .build();

    const createGame = gameFactory(eventPublisher);

    return (
      <div className="App">
          {!game && <LevelSelector onSelect={(gameLevel) => createGame(gameLevel)}/>}
      </div>
    );
};

export default App;
