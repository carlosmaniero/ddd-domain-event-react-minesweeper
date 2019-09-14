import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {gameFactory, Minesweeper} from "./domain/minesweeper";
import {EventPublisher, eventPublisherBuilder} from "./domain/events/events";
import {GameBoard} from "./components/board/GameBoard";

const App: React.FC = () => {
    const [game, setGame] = useState<Minesweeper>();

    const eventPublisher: EventPublisher = eventPublisherBuilder()
        .listen(Minesweeper.events.created, setGame)
        .listen(Minesweeper.events.started, setGame)
        .listen(Minesweeper.events.revealed, setGame)
        .listen(Minesweeper.events.gameOver, setGame)
        .listen(Minesweeper.events.finished, setGame)
        .build();

    const createGame = gameFactory(eventPublisher);

    return (
      <div className="App">
          {!game && <LevelSelector onSelect={(gameLevel) => createGame(gameLevel)}/>}
          {game && <GameBoard game={game}/>}
          {game && game.isGameOver() && "Perdeu!"}
          {game && game.isFinished() && "Ganhou!"}
      </div>
    );
};

export default App;
