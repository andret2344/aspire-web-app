import React from 'react';
import {screen} from '@testing-library/dom';
import {VerifyEmailPage} from '../../Pages/VerifyEmailPage';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import {renderForTest} from '../Utils/RenderForTest';

describe('VerifyEmailPage', (): void => {
	beforeEach((): void => localStorage.clear());

	test('renders correctly', (): void => {
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

	test('resend handle click', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(<VerifyEmailPage />);

		// act
		const resendButton: HTMLElement = screen.getByRole('button', {
			name: 'resend-email'
		});
		await user.click(resendButton);

		// assert
		// TODO: Fill in after implementation
	});
});
