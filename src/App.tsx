import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {Game, gameFactory} from "./domain/game";
import {EventPublisher, eventPublisherBuilder} from "./domain/events/events";

const App: React.FC = () => {
    const [game, setGame] = useState<Game>();

    const eventPublisher: EventPublisher = eventPublisherBuilder()
        .listen(Game.events.created, setGame)
        .build();

    const createGame = gameFactory(eventPublisher);

    return (
      <div className="App">
          {!game && <LevelSelector onSelect={(gameLevel) => createGame(gameLevel)}/>}
      </div>
    );
};

export default App;
