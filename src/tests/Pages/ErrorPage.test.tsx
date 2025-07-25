import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ErrorPage} from '../../main/Page/ErrorPage';
import {renderForTest} from '../__utils__/RenderForTest';

describe('ErrorPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<ErrorPage />);

		// act
		const errorText: HTMLElement = screen.getByText('something-went-wrong');

		// assert
		expect(errorText).toBeInTheDocument();
	});
});
