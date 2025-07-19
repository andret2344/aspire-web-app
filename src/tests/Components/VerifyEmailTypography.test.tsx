import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../__utils__/RenderForTest';
import {VerifyEmailTypography} from '../../main/Components/VerifyEmailTypography';

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
