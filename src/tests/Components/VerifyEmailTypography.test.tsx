import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {VerifyEmailTypography} from '@component/VerifyEmailTypography';
import {renderForTest} from '../__utils__/RenderForTest';

describe('VerifyEmailTypography', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(
			<VerifyEmailTypography>
				<span data-testid='verify-email-child'>hello</span>
			</VerifyEmailTypography>
		);

		// act
		const div: HTMLElement = screen.getByTestId('verify-email-child');

		// assert
		expect(div).toBeInTheDocument();
	});
});
