import React from "react";
import styled from "styled-components";

const Button = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 1rem 2rem;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s ease-in-out;
  color: #333;
  
  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);  
  } 
`;

export interface RegularButtonProps {
    children: React.ReactNode,
    onClick: () => void,
    className?: string,
}

export const RegularButton = ({children, onClick, className}: RegularButtonProps) => (<Button className={className} onClick={() => onClick()}>{children}</Button>);