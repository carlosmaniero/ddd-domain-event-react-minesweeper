import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Welcome} from '@storybook/react/demo';
import {RegularButton} from "../components/designSystem/buttons/RegularButton";
import {LevelButton} from "../components/levelSelector/LevelButton";
import {minesweeperFactory} from "../domain/minesweeper/minesweeper";
import {LevelSelector} from "../components/levelSelector/LevelSelector";
import {GameBoard} from "../components/board/GameBoard";
import {MineType} from "../domain/minesweeper/board/mine";
import {Position} from "../domain/position/position";
import {GamePositionButton} from "../components/board/GamePositionButton";
import {GameLevel} from "../domain/minesweeper/gameLevel";

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
    .add('with text', () => <RegularButton onClick={action('clicked')}>Hello Button 2</RegularButton>);

const levelButtonStory = storiesOf('LevelButton', module);

Object.values(GameLevel).forEach((level) =>
    levelButtonStory.add(level, () =>  <LevelButton onClick={action('clicked')} level={level}/>));

storiesOf('LevelSelector', module)
    .add(`default`, () => <LevelSelector onSelect={action('selected')}/>);

const eventPublisherLog = {
    publish: action('eventPublished')
};

storiesOf('Game Board', module)
    .add(`New Game - Easy`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.EASY)} />)
    .add(`New Game - Medium`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.MEDIUM)} />)
    .add(`New Game - Hard`, () => <GameBoard game={minesweeperFactory(eventPublisherLog)(GameLevel.HARD)} />)
    .add(`Game - Started no mine`, () => {
        const game = minesweeperFactory(eventPublisherLog, () => () => MineType.NotMine)(GameLevel.EASY)
            .revealPosition(Position.of({x: 2, y: 2}));
        return <GameBoard game={game} />
    })
    .add(`Game - Started mine`, () => {
        const game = minesweeperFactory(eventPublisherLog, () => () => MineType.Mine)(GameLevel.EASY)
            .revealPosition(Position.of({x: 2, y: 2}));
        return <GameBoard game={game} />
    });

storiesOf('Game Position', module)
    .add(`Game Position - 1`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 1, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 2`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 2, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 3`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 3, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 4`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 4, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 5`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 5, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 6`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 6, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 7`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 7, position: Position.of({x: 0, y: 0})}} />)
    .add(`Game Position - 8`, () => <GamePositionButton
        onClick={action('clicked')}
        boardPosition={{type: 'REVEALED_WITH_BOMB_NEAR', bombCount: 8, position: Position.of({x: 0, y: 0})}} />);