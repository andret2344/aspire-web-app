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
		const verifyEmailText = screen.getByText(
			/please verify your e-mail\./i
		);
		const instructionText = screen.getByText(
			'Just click on the link in that email to complete your'
		);
		const resendButton = screen.getByRole('button', {
			name: /resend verification e-mail/i
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
		const resendButton = screen.getByRole('button', {
			name: /resend verification e-mail/i
		});
		await user.click(resendButton);

		// assert
		// TODO: Fill in after implementation
	});
});
