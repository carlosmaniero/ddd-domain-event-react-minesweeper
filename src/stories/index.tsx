import React from 'react';

import {action} from '@storybook/addon-actions';

import {RegularButton} from "../view/components/designSystem/buttons/RegularButton";
import {LevelButton} from "../view/components/levelSelector/LevelButton";
import {minesweeperFactory} from "../domain/minesweeper/minesweeper";
import {LevelSelector} from "../view/components/levelSelector/LevelSelector";
import {GameBoard} from "../view/components/board/GameBoard";
import {MineType} from "../domain/minesweeper/field/mine";
import {Coordinate} from "../domain/coordinate/coordinate";
import {GameCoordinateButton} from "../view/components/board/GameCoordinateButton";
import {GameLevel, getAllGameLevels} from "../domain/minesweeper/gameLevel";
import {GameOver} from "../view/components/gameStatus/gameOver";
import {storiesOf} from "@storybook/react";
import {GameWin} from "../view/components/gameStatus/gameWin";

const eventPublisherLog = {
    publish: action('eventPublished')
};

storiesOf('Welcome', module).add('to Storybook', () => <div />);

storiesOf('Button', module)
    .add('with text', () => <RegularButton onClick={action('clicked')}>Hello Button 2</RegularButton>);

const levelButtonStory = storiesOf('LevelButton', module);

getAllGameLevels().forEach((level) =>
    levelButtonStory.add(level, () =>  <LevelButton onClick={action('clicked')} level={level}/>));

storiesOf('LevelSelector', module)
    .add(`default`, () => <LevelSelector onSelect={action('selected')}/>);

storiesOf('Game Board', module)
    .add(`New Game - Easy`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.EASY)} />)
    .add(`New Game - Medium`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.MEDIUM)} />)
    .add(`New Game - Hard`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.HARD)} />)
    .add(`Game - Started no mine`, () => {
        const game = minesweeperFactory(eventPublisherLog, () => () => MineType.NotMine)(GameLevel.EASY);
        game.sweep(Coordinate.of({x: 2, y: 2}));
        return <GameBoard game={game} />
    })
    .add(`Game - Started mine`, () => {
        const game = minesweeperFactory(eventPublisherLog, () => () => MineType.Mine)(GameLevel.EASY);
        game.sweep(Coordinate.of({x: 2, y: 2}));
        return <GameBoard game={game} />
    });

storiesOf('Game Coordinate', module)
    .add(`Game Coordinate - 1`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 1, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 2`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 2, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 3`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 3, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 4`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 4, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 5`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 5, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 6`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 6, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 7`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 7, coordinate: Coordinate.of({x: 0, y: 0})}} />)
    .add(`Game Coordinate - 8`, () => <GameCoordinateButton
        onMouseEnter={action('mouseEnter')}
        onClick={action('clicked')}
        boardCoordinate={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 8, coordinate: Coordinate.of({x: 0, y: 0})}} />);

storiesOf('Game Status', module)
    .add(`Game Over`, () => <GameOver />)
    .add(`Game Win`, () => <GameWin />);