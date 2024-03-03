import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ProfilePage} from '../../Pages/ProfilePage';
import {renderForTest} from '../Utils/RenderForTest';

describe('ProfilePage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		renderForTest(<ProfilePage />);

		// act
		const profileSettingsText = screen.getByText('Profile settings');
		const saveButton = screen.getByRole('button', {name: 'Save'});

		// assert
		expect(profileSettingsText).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});
});
