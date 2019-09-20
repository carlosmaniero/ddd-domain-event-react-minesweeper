import React, {useState} from 'react';
import './App.css';
import {LevelSelector} from "./components/levelSelector/LevelSelector";
import {Minesweeper} from "./domain/minesweeper/minesweeper";
import {GameBoard} from "./components/board/GameBoard";
import {createEventHandler} from "./infrastructure/events/eventHandler";
import {CreateMinesweeperService} from "./domain/minesweeper/services/createMinesweeperService";

const App: React.FC = () => {
    const [game, setGame] = useState<Minesweeper>();

    const eventPublisher = createEventHandler();
    eventPublisher.listen(Minesweeper.events.created, setGame);
    eventPublisher.listen(Minesweeper.events.started, setGame);
    eventPublisher.listen(Minesweeper.events.revealed, setGame);
    eventPublisher.listen(Minesweeper.events.gameOver, setGame);
    eventPublisher.listen(Minesweeper.events.finished, setGame);

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
