import React from "react";
import styled from "styled-components";
import {OverlayMessage} from "../designSystem/messages/OverlayMessage";

const GameOverSection = styled(OverlayMessage)`
    color: red;
`;

export const GameOver: React.FC = () => <GameOverSection>
    <h1>Game Over!</h1>
</GameOverSection>