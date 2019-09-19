import {LevelButton} from "./LevelButton";
import {GameLevel, getAllGameLevels} from "../../domain/minesweeper/minesweeper";
import React from "react";
import styled from "styled-components";

const LevelSelectorSection = styled.section`
  border-radius: 10px;
  border: 1px solid #767c8a;
  padding: 20px;
`;

const LevelButtonSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const LevelButtonWithMargin = styled(LevelButton)`
  margin: 10px 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LevelSelectorTitle = styled.h1`
  margin: 0 0 20px;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
`;

export interface LevelSelectorProps {
    onSelect: (level: GameLevel) => void;
}

export const LevelSelector = ({onSelect}: LevelSelectorProps) =>
    <LevelSelectorSection>
        <LevelSelectorTitle>Choose the Game Level</LevelSelectorTitle>
        <LevelButtonSection>
            {getAllGameLevels().map((gameLevel) =>
                <LevelButtonWithMargin key={gameLevel} level={gameLevel} onClick={() => onSelect(gameLevel)} />)}
        </LevelButtonSection>
    </LevelSelectorSection>;