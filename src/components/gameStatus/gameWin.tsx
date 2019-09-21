import React from "react";
import styled from "styled-components";
import {OverlayMessage} from "../designSystem/messages/OverlayMessage";

const GameOverSection = styled(OverlayMessage)`
    color: #5f9898;
`;

export const GameWin: React.FC = () => <GameOverSection>
    <h1>You Win!</h1>
</GameOverSection>