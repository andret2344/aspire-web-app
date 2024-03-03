import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ErrorPage} from '../../Pages/ErrorPage';
import {renderForTest} from '../Utils/RenderForTest';

describe('ErrorPage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<ErrorPage />);

		// act
		const errorText = screen.getByText('Something went wrong.');

		// assert
		expect(errorText).toBeInTheDocument();
	});
});
