import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import {Header} from '@component/Header';

describe('Header', (): void => {
	it('renders', (): void => {
		// arrange
		renderForTest(<Header />);

		// act
		const logoName: HTMLElement = screen.getByText('Aspire');

		// assert
		expect(logoName).toBeInTheDocument();
	});
});
