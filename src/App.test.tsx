import React from 'react';
import App from "./App";
import {EventHandlerContext} from "./view/components/eventHandler/eventHandlerContext";
import {fireEvent, render} from "@testing-library/react";
import {createEventHandler} from "./infrastructure/events/eventHandler";
import {Minesweeper, minesweeperFactory} from "./domain/minesweeper/minesweeper";
import {act} from "react-dom/test-utils";
import {Coordinate} from "./domain/coordinate/coordinate";
import {MineType} from "./domain/minesweeper/field/mine";
import {GameLevel} from "./domain/minesweeper/gameLevel";


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

      expect(queryByLabelText("Coordinate 1x1")).not.toBeNull();
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
        minesweeper.sweep(Coordinate.of({x: 0, y: 0}));
      });

      expect(queryByLabelText('Coordinate 1x1 reveled with no bomb near'))
          .not.toBeNull();
    });

    it('revels a coordinate', () => {
      const eventHandler = createEventHandler();

      const {queryByLabelText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler, oddMineGenerator)(GameLevel.EASY);
        minesweeper.sweep(Coordinate.of({x: 0, y: 0}));
        minesweeper.sweep(Coordinate.of({x: 2, y: 2}));
      });

      expect(queryByLabelText('Coordinate 3x3 reveled with 6 bombs near'))
          .not.toBeNull();
    });

    it('shows game over', () => {
      const eventHandler = createEventHandler();

      const {queryByText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      expect(queryByText("Game Over!")).toBeNull();

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler, oddMineGenerator)(GameLevel.EASY);
        minesweeper.sweep(Coordinate.of({x: 0, y: 0}));
        minesweeper.sweep(Coordinate.of({x: 3, y: 1}));
      });

      expect(queryByText("Game Over!"))
          .not.toBeNull();
    });

    it('shows game is finished', () => {
      const eventHandler = createEventHandler();

      const {queryByText} = render(
          <EventHandlerContext.Provider value={eventHandler}>
            <App/>
          </EventHandlerContext.Provider>);

      act(() => {
        const minesweeper = minesweeperFactory(eventHandler,
            () => (coordinate) =>
                coordinate.isPresent([
                  Coordinate.of({x: 0, y: 0}),
                  Coordinate.of({x: 3, y: 2})
                ])
                    ? MineType.NotMine : MineType.Mine
        )(GameLevel.EASY);

        minesweeper.sweep(Coordinate.of({x: 0, y: 0}));
        minesweeper.sweep(Coordinate.of({x: 3, y: 2}));
      });

      expect(queryByText("You Win!")).not.toBeNull();
    });
  });
});

const oddMineGenerator = () => (coordinate: Coordinate) => coordinate.x % 2 === 1 ? MineType.Mine : MineType.NotMine;