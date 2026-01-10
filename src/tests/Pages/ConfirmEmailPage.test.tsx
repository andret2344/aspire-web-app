import {mockedConfirmEmail} from '../__mocks__/MockAuthService';
import {mockedUseParams} from '../__mocks__/MockCommonService';
import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {ConfirmEmailPage} from '@page/ConfirmEmailPage';
import {BrowserRouter} from 'react-router-dom';

describe('ConfirmEmailPage', (): void => {
	beforeEach((): void => {
		jest.clearAllMocks();
	});

	it('renders loading state initially', (): void => {
		// arrange
		mockedUseParams.mockReturnValue({token: 'test-token'});
		mockedConfirmEmail.mockImplementation(() => Promise.resolve());

		// act
		renderForTest(<ConfirmEmailPage />);

		// assert
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('renders success message when email is confirmed', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({token: 'valid-token'});
		mockedConfirmEmail.mockResolvedValue(undefined);

		// act
		renderForTest(<ConfirmEmailPage />);

		// assert
		await waitFor(() => {
			expect(screen.getByText('email-confirmed')).toBeInTheDocument();
			expect(screen.getByText('email-confirmed-message')).toBeInTheDocument();
		});
		expect(mockedConfirmEmail).toHaveBeenCalledTimes(1);
		expect(mockedConfirmEmail).toHaveBeenCalledWith('valid-token');
	});

	it('renders error message when confirmation fails', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({token: 'invalid-token'});
		mockedConfirmEmail.mockRejectedValue(new Error('Invalid token'));

		// act
		renderForTest(<ConfirmEmailPage />);

		// assert
		await waitFor(() => {
			expect(screen.getByText('email-not-confirmed')).toBeInTheDocument();
			expect(screen.getByText('email-not-confirmed-message')).toBeInTheDocument();
		});
		expect(mockedConfirmEmail).toHaveBeenCalledTimes(1);
		expect(mockedConfirmEmail).toHaveBeenCalledWith('invalid-token');
	});

	it('renders error message when token is missing', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({});

		// act
		renderForTest(<ConfirmEmailPage />);

		// assert
		await waitFor(() => {
			expect(screen.getByText('email-not-confirmed')).toBeInTheDocument();
			expect(screen.getByText('email-not-confirmed-message')).toBeInTheDocument();
		});
		expect(mockedConfirmEmail).not.toHaveBeenCalled();
	});

	it('calls confirmEmail only once per unique token', async (): Promise<void> => {
		// arrange
		mockedUseParams.mockReturnValue({token: 'unique-token'});
		mockedConfirmEmail.mockResolvedValue(undefined);

		// act
		renderForTest(<ConfirmEmailPage />);

		// assert
		await waitFor(() => {
			expect(screen.getByText('email-confirmed')).toBeInTheDocument();
		});
		expect(mockedConfirmEmail).toHaveBeenCalledTimes(1);
		expect(mockedConfirmEmail).toHaveBeenCalledWith('unique-token');
	});

	it('prevents duplicate calls when useEffect triggers multiple times with same token', async (): Promise<void> => {
		// arrange
		const token = 'duplicate-token';
		mockedUseParams.mockReturnValue({token});

		let callCount = 0;
		mockedConfirmEmail.mockImplementation(async (): Promise<void> => {
			callCount++;
			// Simulate async delay
			await new Promise((resolve) => setTimeout(resolve, 10));
			return Promise.resolve();
		});

		// act - Wrap in StrictMode to trigger double useEffect calls
		render(
			<React.StrictMode>
				<BrowserRouter>
					<ConfirmEmailPage />
				</BrowserRouter>
			</React.StrictMode>
		);

		// assert
		// Wait for the confirmation to complete
		await waitFor(() => {
			expect(screen.getByText('email-confirmed')).toBeInTheDocument();
		});

		// The requestLockRef ensures confirmEmail is called only once even if
		// useEffect runs multiple times (e.g., in React StrictMode)
		expect(mockedConfirmEmail).toHaveBeenCalledTimes(1);
		expect(callCount).toBe(1);
	});
});
