import {createEventHandler} from "../../infrastructure/events/eventHandler";
import React from "react";

export const EventHandlerContext = React.createContext(createEventHandler());