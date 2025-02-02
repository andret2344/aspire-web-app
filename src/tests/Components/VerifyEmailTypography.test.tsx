import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';
import {VerifyEmailTypography} from '../../Components/VerifyEmailTypography';

describe('VerifyEmailTypography', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(
			<VerifyEmailTypography>
				<div data-testid='verify-email-child'>hello</div>
			</VerifyEmailTypography>
		);

		// act
		const div: HTMLElement = screen.getByTestId('verify-email-child');

		// assert
		expect(div).toBeInTheDocument();
	});
});
