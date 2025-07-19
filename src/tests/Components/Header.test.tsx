import {mockedIsTokenValid} from '../__mocks__/MockAuthService';
import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {Header} from '../../main/Components/Header';
import {renderForTest} from '../__utils__/RenderForTest';

describe('Header', (): void => {
	it('renders', (): void => {
		// arrange
		mockedIsTokenValid.mockReturnValue(true);
		renderForTest(<Header />);

		// act
		const logoName: HTMLElement = screen.getByText('Aspire');

		// assert
		expect(logoName).toBeInTheDocument();
	});
});
