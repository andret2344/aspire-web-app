import {mockedGetWishlist} from '../../__mocks__/MockWishlistService';
import {mockedUseMediaQuery} from '../../__mocks__/MockMaterialUI';
import {
	mockedAddWishlistItem,
	mockedUpdateWishlistItem
} from '../../__mocks__/MockWishlistItemService';
import '../../__mocks__/MockMDXEditor';
import '@testing-library/jest-dom';
import React from 'react';
import {DescriptionModal} from '../../../main/Components/Modals/DescriptionModal';
import {fireEvent, screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {renderForTest} from '../../__utils__/RenderForTest';
import {
	getSampleWishlistDto,
	getSampleWishlistItem,
	getSampleWishlistItemDto
} from '../../__utils__/DataFactory';
import {WishlistItemDto} from '../../../main/Entity/WishlistItem';

describe('DescriptionModal', (): void => {
	beforeEach((): void => localStorage.clear());

	test('input change', async (): Promise<void> => {
		// arrange
		const item: WishlistItemDto = getSampleWishlistItemDto({
			name: 'New name'
		});
		mockedUpdateWishlistItem.mockResolvedValue(item);
		mockedGetWishlist.mockReturnValue(
			getSampleWishlistDto({wishlist_items: [item]})
		);
		mockedUseMediaQuery.mockReturnValueOnce(false);
		user.setup();
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				item={getSampleWishlistItem()}
			/>
		);

		const inputName: HTMLInputElement = screen
			.getByTestId('edit-item-modal-input-name')
			.querySelector('input') as HTMLInputElement;
		const prioritySelect: HTMLSelectElement = screen.getByRole('combobox');

		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		// act
		await user.clear(inputName);
		await user.type(inputName, 'New name');
		await user.click(prioritySelect);

		const secondOptionPriority: HTMLElement =
			await screen.findByTestId('priority-item-2');
		await user.click(secondOptionPriority);
		await user.click(saveButton);

		// assert
		expect(mockedUpdateWishlistItem).toHaveBeenCalledTimes(1);
	});

	test('tooltip works properly when no password', (): void => {
		// arrange
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				item={getSampleWishlistItem()}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		fireEvent.click(screen.getByTestId('tooltip-test'));

		// assert
		expect(screen.getByText('hide-item-tooltip')).toBeInTheDocument();
	});

	test('tooltip does not show up when password is set', (): void => {
		// arrange
		renderForTest(
			<DescriptionModal
				wishlistPassword={true}
				wishlistId={1}
				item={getSampleWishlistItem({hidden: true})}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		fireEvent.click(screen.getByTestId('tooltip-test'));

		// assert
		expect(screen.queryByText('hide-item-tooltip')).toBeNull();
	});

	test('add new item', async (): Promise<void> => {
		// arrange
		mockedAddWishlistItem.mockReturnValue(
			getSampleWishlistItem({
				id: 2,
				description: 'New Item',
				name: 'new wishlist item'
			})
		);
		mockedUseMediaQuery.mockReturnValueOnce(true);
		user.setup();
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		const inputName: HTMLInputElement = screen
			.getByTestId('edit-item-modal-input-name')
			.querySelector('input') as HTMLInputElement;
		const prioritySelect: HTMLSelectElement = screen.getByRole('combobox');
		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		// act
		await user.type(inputName, 'New name');
		await user.click(saveButton);

		// assert
		expect(mockedAddWishlistItem).toHaveBeenCalledTimes(1);
		expect(prioritySelect).toBeInTheDocument();
	});

	test('add new item too long name', async (): Promise<void> => {
		// arrange
		mockedAddWishlistItem.mockReturnValue(null);
		user.setup();
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		const inputName: HTMLInputElement = screen
			.getByTestId('edit-item-modal-input-name')
			.querySelector('input') as HTMLInputElement;
		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		// act
		await user.type(inputName, 'New name');
		await user.click(saveButton);

		// assert
		expect(screen.getByText('too-long')).toBeInTheDocument();
	});

	test('clicks cancel button', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
				item={getSampleWishlistItem()}
			/>
		);

		const cancelButton: HTMLElement = screen.getByTestId(
			'edit-item-modal-cancel'
		);

		// act
		await user.click(cancelButton);

		// assert ???
	});

	test('tries to confirm with an empty name', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<DescriptionModal
				wishlistId={1}
				open={true}
				onClose={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		// act
		const confirmButton: HTMLElement = screen.getByTestId(
			'edit-item-modal-confirm'
		);

		// assert
		expect(confirmButton).toHaveAttribute('disabled', '');
	});
});
