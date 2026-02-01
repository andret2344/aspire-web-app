import {renderForTest} from '../__utils__/RenderForTest';
import React from 'react';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {FaqPage} from '@page/FaqPage';

describe('FaqPage', (): void => {
	it('renders FAQ title', (): void => {
		// arrange
		renderForTest(<FaqPage />);

		// act
		const title: HTMLElement = screen.getByText('description');

		// assert
		expect(title).toBeInTheDocument();
	});

	it('renders FAQ items from translation', (): void => {
		// arrange
		renderForTest(<FaqPage />);

		// act
		const items = screen.getAllByRole('button');

		// assert
		expect(items.length).toBeGreaterThan(0);
	});

	it('expands and collapses FAQ item', async (): Promise<void> => {
		// arrange
		renderForTest(<FaqPage />);
		const firstAccordion: HTMLElement = screen.getAllByRole('button')[0];

		// act - expand
		await user.click(firstAccordion);

		// assert - should be expanded
		expect(firstAccordion).toHaveAttribute('aria-expanded', 'true');

		// act - collapse
		await user.click(firstAccordion);

		// assert - should be collapsed
		expect(firstAccordion).toHaveAttribute('aria-expanded', 'false');
	});
});
