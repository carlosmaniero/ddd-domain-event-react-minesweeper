import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Welcome} from '@storybook/react/demo';
import {RegularButton} from "../components/designSystem/buttons/RegularButton";
import {LevelButton} from "../components/levelSelector/LevelButton";
import {gameFactory, GameLevel} from "../domain/game";
import {LevelSelector} from "../components/levelSelector/LevelSelector";
import {GameBoard} from "../components/board/GameBoard";

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
    .add(`New Game - Easy`, () => <GameBoard game={gameFactory(eventPublisherLog)(GameLevel.EASY)} />)
    .add(`New Game - Medium`, () => <GameBoard game={gameFactory(eventPublisherLog)(GameLevel.MEDIUM)} />)
    .add(`New Game - Hard`, () => <GameBoard game={gameFactory(eventPublisherLog)(GameLevel.HARD)} />);