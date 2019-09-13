import {LevelButton} from "./LevelButton";
import {GameLevel} from "../../domain/game";
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

export const LevelSelector = () =>
    <LevelSelectorSection>
        <LevelSelectorTitle>Choose the Game Level</LevelSelectorTitle>
        <LevelButtonSection>
            <LevelButtonWithMargin level={GameLevel.EASY} onClick={() => null} />
            <LevelButtonWithMargin level={GameLevel.MEDIUM} onClick={() => null} />
            <LevelButtonWithMargin level={GameLevel.HARD} onClick={() => null} />
        </LevelButtonSection>
    </LevelSelectorSection>;