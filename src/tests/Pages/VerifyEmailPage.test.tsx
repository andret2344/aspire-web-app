import React from 'react';
import {VerifyEmailPage} from '@page/VerifyEmailPage';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import {renderForTest} from '../__utils__/RenderForTest';

describe('VerifyEmailPage', (): void => {
	beforeEach((): void => localStorage.clear());

	it('renders correctly', (): void => {
		// arrange
		renderForTest(<VerifyEmailPage />);

		// act
		const verifyEmailText: HTMLElement = screen.getByText('verify-email');
		const instructionText: HTMLElement = screen.getByText('click-the-link');
		const resendButton: HTMLElement = screen.getByRole('button', {
			name: 'resend-email'
		});

		// assert
		expect(verifyEmailText).toBeInTheDocument();
		expect(instructionText).toBeInTheDocument();
		expect(resendButton).toBeInTheDocument();
	});

	it('handles resend button click', async (): Promise<void> => {
		// arrange
		renderForTest(<VerifyEmailPage />);

		// act
		const resendButton: HTMLElement = screen.getByTestId('resend-email-button');
		await user.click(resendButton);

		// assert
		// TODO: Fill in after implementation
	});
});
