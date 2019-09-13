import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Welcome} from '@storybook/react/demo';
import {RegularButton} from "../components/designSystem/buttons/RegularButton";
import {LevelButton} from "../components/levelSelector/LevelButton";
import {GameLevel} from "../domain/game";
import {LevelSelector} from "../components/levelSelector/LevelSelector";

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
    .add('with text', () => <RegularButton onClick={action('clicked')}>Hello Button 2</RegularButton>);

const levelButtonStory = storiesOf('LevelButton', module);

Object.values(GameLevel).forEach((level) =>
    levelButtonStory.add(level, () =>  <LevelButton onClick={action('clicked')} level={level}/>));

storiesOf('LevelSelector', module)
    .add(`default`, () => <LevelSelector onSelect={action('selected')}/>);