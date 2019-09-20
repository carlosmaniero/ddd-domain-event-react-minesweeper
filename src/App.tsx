import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {Minesweeper} from "./domain/minesweeper/minesweeper";
import {EventPublisher} from "./domain/events/events";
import {GameBoard} from "./components/board/GameBoard";
import {eventPublisherBuilder} from "./infrastructure/events/eventPublisher";
import {CreateMinesweeperService} from "./domain/minesweeper/services/createMinesweeperService";

const App: React.FC = () => {
    const [game, setGame] = useState<Minesweeper>();

    const eventPublisher: EventPublisher = eventPublisherBuilder()
        .listen(Minesweeper.events.created, setGame)
        .listen(Minesweeper.events.started, setGame)
        .listen(Minesweeper.events.revealed, setGame)
        .listen(Minesweeper.events.gameOver, setGame)
        .listen(Minesweeper.events.finished, setGame)
        .build();

    const createMinesweeperService = new CreateMinesweeperService(eventPublisher);

    return (
      <div className="App">
          {!game && <LevelSelector onSelect={(gameLevel) => createMinesweeperService.create(gameLevel)}/>}
          {game && <GameBoard game={game}/>}
          {game && game.isGameOver() && "Perdeu!"}
          {game && game.isFinished() && "Ganhou!"}
      </div>
    );
};

export default App;
