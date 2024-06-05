import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {AccessPasswordModal} from '../../Components/AccessPasswordModal';
import {renderForTest} from '../Utils/RenderForTest';
import {fireEvent} from '@testing-library/react';

describe('AccessPasswordModal', (): void => {
	//arrange
	test('renders reveal modal corretly', (): void => {
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={true}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);
		// assert
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument;
	});

	test('renders hide pass modal corretly', (): void => {
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={true}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={false}
			/>
		);
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument;
	});
	test('password visibility toggle works', (): void => {
		// arrange
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={true}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		// act
		const passwordInput = screen.getByPlaceholderText('Password');
		const toggleButton = screen.getByTestId('visibilityIcon');

		// assert
		expect(passwordInput).toHaveAttribute('type', 'password');
		fireEvent.click(toggleButton);
		expect(passwordInput).toHaveAttribute('type', 'text');
	});
	test('reveal modal works correctly with correct password', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={false}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		//assert
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
	});
	test('hide pass modal works correctly with correct password', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={true}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={false}
			/>
		);

		//assert
		fireEvent.change(screen.getByPlaceholderText('Password'), {
			target: {value: 'password123'}
		});
	});

	test('cancel button is clickable in the reveal modal', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={false}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={true}
			/>
		);

		//assert
		fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
	});
	test('cancel button is clickable in the hide pass modal', (): void => {
		//arrange
		renderForTest(
			<AccessPasswordModal
				setHidePassModalOpened={() => undefined}
				hidePassModalOpened={true}
				setRevealPassModalOpened={() => undefined}
				revealPassModalOpened={false}
			/>
		);

		//assert
		fireEvent.click(screen.getByRole('button', {name: 'Cancel'}));
	});
});
