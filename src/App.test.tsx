import React from 'react';
import App from "./App";
import {EventHandlerContext} from "./components/eventHandler/eventHandlerContext";
import {fireEvent, render} from "@testing-library/react";
import {createEventHandler} from "./infrastructure/events/eventHandler";
import {GameLevel, Minesweeper, minesweeperFactory} from "./domain/minesweeper/minesweeper";
import {act} from "react-dom/test-utils";
import {Position} from "./domain/position/position";
import {MineType} from "./domain/minesweeper/board/mine";


describe('App Integration test', () => {
  describe('Level Selector', () => {
    it('Renders the Level Selector', async () => {
      const {queryByText} = render(<App/>);

      expect(queryByText('Choose the Game Level')).not.toBeNull();
    });

    it('Hides the level selector after ', async () => {
      const {getByText, queryByText} = render(<App/>);

      fireEvent.click(getByText('Easy'));

      expect(queryByText('Easy')).toBeNull();
    });

    it('produces a game creation event', () => {
      const createdMock = jest.fn();
      const eventHandler = createEventHandler();
      eventHandler.listen(Minesweeper.events.created, createdMock);

      const {getByText} = render(
              <EventHandlerContext.Provider value={eventHandler}>
                <App/>
              </EventHandlerContext.Provider>);

      fireEvent.click(getByText('Easy'));

      expect(createdMock).toBeCalled();
      const minesweeper = createdMock.mock.calls[0][0];
      expect(minesweeper.gameLevel).toEqual(GameLevel.EASY)
    })
  });

  describe('Showing the board', () => {
    it('Shows the board when a game is created', () => {
      const eventHandler = createEventHandler();

      const {queryByLabelText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler)(GameLevel.EASY);
        eventHandler.publish(Minesweeper.events.created(minesweeper));
      });

      expect(queryByLabelText("Position 1x1")).not.toBeNull();
    });

    it('Shows a started minesweeper', () => {
      const eventHandler = createEventHandler();

      const {queryByLabelText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler)(GameLevel.EASY);
        eventHandler.publish(Minesweeper.events.created(minesweeper));
        minesweeper.revealPosition(Position.of({x: 0, y: 0}));
      });

      expect(queryByLabelText('Position 1x1 reveled with no bomb near'))
          .not.toBeNull();
    });

    it('revels a position', () => {
      const eventHandler = createEventHandler();

      const {queryByLabelText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler, oddMineGenerator)(GameLevel.EASY);
        minesweeper.revealPosition(Position.of({x: 0, y: 0}));
        minesweeper.revealPosition(Position.of({x: 2, y: 2}));
      });

      expect(queryByLabelText('Position 3x3 reveled with 6 bombs near'))
          .not.toBeNull();
    });
  });
});

const oddMineGenerator = () => (position: Position) => position.x % 2 === 1 ? MineType.Mine : MineType.NotMine;