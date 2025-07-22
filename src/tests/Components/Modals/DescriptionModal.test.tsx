import {mockedGetMarkdown} from '../../__mocks__/MockMDXEditor';

import React from 'react';
import '@testing-library/jest-dom';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {DescriptionModal} from '../../../main/Components/Modals/DescriptionModal';
import {
	renderForTest,
	renderForTestWithMockedDarkModeProvider
} from '../../__utils__/RenderForTest';

describe('DescriptionModal', (): void => {
	beforeEach((): void => localStorage.clear());

	it('renders', async (): Promise<void> => {
		// arrange
		renderForTest(
			<DescriptionModal
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		const cancelButton: HTMLElement = screen.getByTestId(
			'modal-description-cancel'
		);
		const mdxEditor: HTMLElement = screen.getByTestId('mock-mdx-editor');

		// assert
		expect(cancelButton).toBeInTheDocument();
		expect(mdxEditor).not.toHaveClass('dark-theme');
	});

	it('renders when loading', async (): Promise<void> => {
		// arrange
		renderForTest(
			<DescriptionModal
				loading
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		const confirmButton: HTMLElement | null = screen.queryByText('confirm');

		// assert
		expect(confirmButton).toBeNull();
	});

	it('renders in dark theme', async (): Promise<void> => {
		// arrange
		renderForTestWithMockedDarkModeProvider(
			<DescriptionModal
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		const mdxEditor: HTMLElement = screen.getByTestId('mock-mdx-editor');

		// assert
		expect(mdxEditor).toHaveClass('dark-theme');
	});

	test('clicks accept button', async (): Promise<void> => {
		// arrange
		const handleAccept: jest.Mock = jest.fn();
		mockedGetMarkdown.mockReturnValue('test');
		renderForTest(
			<DescriptionModal
				open={true}
				onClose={(): void => undefined}
				onAccept={handleAccept}
			/>
		);

		const confirmButton: HTMLElement = screen.getByTestId(
			'modal-description-confirm'
		);

		// act
		await user.click(confirmButton);

		// assert
		expect(handleAccept).toHaveBeenCalledTimes(1);
		expect(handleAccept).toHaveBeenCalledWith('test');
	});

	test('clicks cancel button', async (): Promise<void> => {
		// arrange
		const handleClose: jest.Mock = jest.fn();
		renderForTest(
			<DescriptionModal
				open={true}
				onClose={handleClose}
				onAccept={(): void => undefined}
			/>
		);

		const cancelButton: HTMLElement = screen.getByTestId(
			'modal-description-cancel'
		);

		// act
		await user.click(cancelButton);

		// assert
		expect(handleClose).toHaveBeenCalledTimes(1);
	});
});
