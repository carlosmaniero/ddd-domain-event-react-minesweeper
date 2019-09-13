import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {Game, gameFactory} from "./domain/game";
import {EventPublisher} from "./domain/events/events";

const App: React.FC = () => {
    const [game, setGame] = useState<Game>();

    const eventPublisher: EventPublisher = {
        publish: (event) => {
            if(Game.events.created.isTypeOf(event)) {
                setGame(event.payload);
            }
        }
    };

    const createGame = gameFactory(eventPublisher);

    return (
      <div className="App">
          {!game && <LevelSelector onSelect={(gameLevel) => createGame(gameLevel)}/>}
      </div>
    );
};

export default App;
