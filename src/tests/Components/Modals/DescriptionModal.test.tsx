import '../../__mocks__/MockMDXEditor';
import '@testing-library/jest-dom';
import React from 'react';
import {DescriptionModal} from '../../../main/Components/Modals/DescriptionModal';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {renderForTest} from '../../__utils__/RenderForTest';

describe('DescriptionModal', (): void => {
	beforeEach((): void => localStorage.clear());

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
