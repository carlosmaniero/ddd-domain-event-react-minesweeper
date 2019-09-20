import React from "react";
import styled, {keyframes} from "styled-components";

const fromTop = keyframes`
  from {
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`;

const GameOverSection = styled.section`
  animation: ${fromTop} 0.2s forwards;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  text-align: center;
  top: 0;
  left: 0;

  h1 {
    width: 100%;
    color: red;
    background: rgba(255, 255, 255, 0.5);
    padding: 5rem;
  }
`;

export const GameOver: React.FC = () => <GameOverSection>
    <h1>Game Over!</h1>
</GameOverSection>