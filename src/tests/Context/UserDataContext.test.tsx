import {renderForTest, withUserDataProvider} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {RenderResult, waitFor} from '@testing-library/react';
import user from '@testing-library/user-event';
import {useUserData, useUserDataActions} from '@context/UserDataContext';

function TestComponent(): React.ReactElement {
	const {user, loaded} = useUserData();
	const {setUser, setLoaded} = useUserDataActions();

	return (
		<div>
			<span>User: {user ? user.email : 'null'}</span>
			<span>Loaded: {loaded ? 'true' : 'false'}</span>
			<button
				onClick={(): void =>
					setUser({
						id: 1,
						email: 'test@example.com',
						isVerified: true,
						lastLogin: new Date()
					})
				}
			>
				Set User
			</button>
			<button onClick={(): void => setUser(null)}>Clear User</button>
			<button onClick={(): void => setLoaded(true)}>Set Loaded</button>
		</div>
	);
}

describe('UserDataProvider', (): void => {
	test('render using provider with initial state', (): void => {
		// arrange
		renderForTest(<TestComponent />, [withUserDataProvider]);

		// act
		const userText: HTMLElement = screen.getByText('User: null');
		const loadedText: HTMLElement = screen.getByText('Loaded: false');

		// assert
		expect(userText).toBeInTheDocument();
		expect(loadedText).toBeInTheDocument();
	});

	test('set user data', async (): Promise<void> => {
		// arrange
		renderForTest(<TestComponent />, [withUserDataProvider]);
		const button: HTMLElement = screen.getByText('Set User');

		// act
		await user.click(button);

		// assert
		const userText: HTMLElement = await waitFor((): HTMLElement =>
			screen.getByText('User: test@example.com')
		);
		expect(userText).toBeInTheDocument();
	});

	test('clear user data', async (): Promise<void> => {
		// arrange
		renderForTest(<TestComponent />, [withUserDataProvider]);
		const setUserButton: HTMLElement = screen.getByText('Set User');
		await user.click(setUserButton);

		const clearButton: HTMLElement = screen.getByText('Clear User');

		// act
		await user.click(clearButton);

		// assert
		const userText: HTMLElement = await waitFor((): HTMLElement => screen.getByText('User: null'));
		expect(userText).toBeInTheDocument();
	});

	test('set loaded state', async (): Promise<void> => {
		// arrange
		renderForTest(<TestComponent />, [withUserDataProvider]);
		const button: HTMLElement = screen.getByText('Set Loaded');

		// act
		await user.click(button);

		// assert
		const loadedText: HTMLElement = await waitFor((): HTMLElement => screen.getByText('Loaded: true'));
		expect(loadedText).toBeInTheDocument();
	});

	it('should throw an error when useUserData is used outside of UserDataProvider', (): void => {
		// arrange
		function TestComponentWithUserData(): React.ReactElement {
			const {user} = useUserData();
			return <div>{user?.email}</div>;
		}

		// act
		function renderer(): RenderResult {
			return renderForTest(<TestComponentWithUserData />, []);
		}

		// assert
		expect(renderer).toThrow('useUserData must be used within <UserDataProvider>');
	});

	it('should throw an error when useUserDataActions is used outside of UserDataProvider', (): void => {
		// arrange
		function TestComponentWithActions(): React.ReactElement {
			const {setUser} = useUserDataActions();
			return <button onClick={(): void => setUser(null)}>Clear</button>;
		}

		// act
		function renderer(): RenderResult {
			return renderForTest(<TestComponentWithActions />, []);
		}

		// assert
		expect(renderer).toThrow('useUserDataActions must be used within <UserDataProvider>');
	});
});
