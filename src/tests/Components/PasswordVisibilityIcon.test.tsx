import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/react';
import {renderForTest} from '../__utils__/RenderForTest';
import {PasswordVisibilityIcon} from '../../main/Components/PasswordVisibilityIcon';

describe('PasswordVisibilityIcon', (): void => {
	test('renders invisible', (): void => {
		// arrange
		renderForTest(<PasswordVisibilityIcon />);

		// act
		const icon: HTMLElement = screen.getByTestId('password-icon-invisible');

		// assert
		expect(icon).toBeInTheDocument();
	});

	test('renders invisible', (): void => {
		// arrange
		renderForTest(<PasswordVisibilityIcon visible />);

		// act
		const icon: HTMLElement = screen.getByTestId('password-icon-visible');

		// assert
		expect(icon).toBeInTheDocument();
	});
});
