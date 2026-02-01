import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {ErrorPage} from '@page/ErrorPage';

describe('ErrorPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<ErrorPage />);

		// act
		const errorText: HTMLElement = screen.getByText('messages.something-went-wrong');

		// assert
		expect(errorText).toBeInTheDocument();
	});
});
