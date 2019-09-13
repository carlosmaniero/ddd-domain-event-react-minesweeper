import React from 'react';
import App from "./App";
import {fireEvent, render} from "@testing-library/react";


describe('', () => {
  it('Hides the level selector after ', async () => {
    const {getByText, queryByText} = render(<App/>);

    fireEvent.click(getByText('Easy'));

    expect(queryByText('Easy')).toBeNull();
  });
});
