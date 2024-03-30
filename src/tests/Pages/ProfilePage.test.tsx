import {mockedUseNavigate} from '../__mocks__/MockCommonService';
import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {ProfilePage} from '../../Pages/ProfilePage';
import {renderForTest} from '../Utils/RenderForTest';

describe('ProfilePage', (): void => {
	test('renders correctly', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<ProfilePage />);

		// act
		const profileSettingsText = screen.getByText('Profile settings');
		const saveButton = screen.getByRole('button', {name: 'Save'});

		// assert
		expect(profileSettingsText).toBeInTheDocument();
		expect(saveButton).toBeInTheDocument();
	});

	test('navigates without token', (): void => {
		// arrange
		renderForTest(<ProfilePage />);

		// assert
		expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
		expect(mockedUseNavigate).toHaveBeenCalledWith('/');
	});
});
