import React from 'react';
import '@testing-library/jest-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {LoginPage} from '../../Pages/LoginPage';
import {screen} from '@testing-library/dom';
import {render} from '@testing-library/react';
import {DarkModeProvider} from '../../Components/DarkModeContext';

describe('login page', (): void => {
	test('renders', (): void => {
		// arrange
		render(
			<DarkModeProvider>
				<Router>
					<LoginPage />
				</Router>
			</DarkModeProvider>
		);

		// assert
		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByText('Login')).toBeInTheDocument();
	});
});
