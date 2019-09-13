import React from "react";
import {render, fireEvent} from '@testing-library/react'
import {RegularButton} from "./RegularButton";

describe('RegularButton', () => {
    it('calls the onClick on click', () => {
        const onClick = jest.fn();
        const { getByText } = render(<RegularButton onClick={onClick}>Hello</RegularButton>);

        fireEvent.click(getByText('Hello'));

        expect(onClick).toBeCalledTimes(1);
    });
});