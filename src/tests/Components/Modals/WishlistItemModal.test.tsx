import {mockedGetWishlist} from '../../__mocks__/MockWishlistService';
import {
	mockedAddWishlistItem,
	mockedEditWishlistItem
} from '../../__mocks__/MockWishlistItemService';

import '@testing-library/jest-dom';
import React from 'react';
import {WishList} from '../../../Entity/WishList';
import {EditItemModal} from '../../../Components/Modals/EditItemModal';
import {screen} from '@testing-library/dom';
import user from '@testing-library/user-event';
import {WishlistItem} from '../../../Entity/WishlistItem';
import {renderForTest} from '../../Utils/RenderForTest';
import {render} from '@testing-library/react';

describe('WishlistItemModal', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockWishlistData: WishList = {
		id: 1,
		uuid: 'random uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3
			}
		]
	};

	const updatedMockWishlistData: WishList = {
		id: 1,
		uuid: 'random uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'updated test description',
				name: 'Item 1 updated',
				priorityId: 2
			}
		]
	};

	const newMockWishlistItem: WishlistItem = {
		id: 2,
		wishlistId: 1,
		description: 'this is totally new wishlist item created by test',
		name: 'new wishlist item',
		priorityId: 3
	};

	test('input change', async (): Promise<void> => {
		// arrange
		mockedEditWishlistItem.mockResolvedValue(updatedMockWishlistData);
		mockedGetWishlist.mockReturnValue(updatedMockWishlistData);
		user.setup();
		renderForTest(
			<EditItemModal
				wishlistId={mockWishlistData.id}
				opened={true}
				toggleModal={(): void => undefined}
				onAccept={(): void => undefined}
				item={mockWishlistData.wishlistItems[0]}
			/>
		);

		const inputName = screen.getByPlaceholderText(
			mockWishlistData.wishlistItems[0].name
		) as HTMLInputElement;
		const prioritySelect = screen.getByRole(
			'combobox'
		) as HTMLSelectElement;

		expect(prioritySelect).toBeInTheDocument();

		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		expect(inputName).toBeInTheDocument();
		expect(inputName.value).toBe('Item 1');

		await user.clear(inputName);
		await user.type(inputName, 'New name');

		expect(inputName.value).toBe('New name');
		await user.click(prioritySelect);

		const secondOptionPriority: HTMLElement = await screen.findByText(
			/Przydałoby mi się, gdyż często odczuwam brak./i
		);

		expect(secondOptionPriority).toBeInTheDocument();
		await user.click(secondOptionPriority);

		expect(saveButton).toBeInTheDocument();
		await user.click(saveButton);

		expect(mockedEditWishlistItem).toHaveBeenCalledTimes(1);
	});

	test('add new item', async (): Promise<void> => {
		// arrange
		mockedAddWishlistItem.mockReturnValue(newMockWishlistItem);
		user.setup();
		renderForTest(
			<EditItemModal
				wishlistId={mockWishlistData.id}
				opened={true}
				toggleModal={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		const inputName = screen.getByPlaceholderText(
			'enter-item'
		) as HTMLInputElement;
		const descriptionInput = screen
			.getByTestId('test-quill')
			.querySelector('.ql-editor') as HTMLInputElement;
		const prioritySelect = screen.getByRole(
			'combobox'
		) as HTMLSelectElement;

		expect(inputName).toBeInTheDocument();
		expect(descriptionInput).toBeInTheDocument();
		expect(prioritySelect).toBeInTheDocument();

		await user.type(inputName, 'New name');
		expect(inputName.value).toBe('New name');

		await user.type(descriptionInput, 'New description');

		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		expect(saveButton).toBeInTheDocument();
		await user.click(saveButton);

		expect(mockedAddWishlistItem).toHaveBeenCalledTimes(1);
	});

	test('add new item too long name or description', async (): Promise<void> => {
		// arrange
		mockedAddWishlistItem.mockReturnValue(null);
		user.setup();
		renderForTest(
			<EditItemModal
				wishlistId={mockWishlistData.id}
				opened={true}
				toggleModal={(): void => undefined}
				onAccept={(): void => undefined}
			/>
		);

		const inputName = screen.getByPlaceholderText(
			'enter-item'
		) as HTMLInputElement;
		const descriptionInput = screen
			.getByTestId('test-quill')
			.querySelector('.ql-editor') as HTMLInputElement;
		const prioritySelect = screen.getByRole(
			'combobox'
		) as HTMLSelectElement;

		expect(inputName).toBeInTheDocument();
		expect(descriptionInput).toBeInTheDocument();
		expect(prioritySelect).toBeInTheDocument();

		await user.type(inputName, 'New name');
		expect(inputName.value).toBe('New name');

		await user.type(descriptionInput, 'New description');

		const saveButton: HTMLElement = screen.getByRole('button', {
			name: /confirm/i
		});

		expect(saveButton).toBeInTheDocument();
		await user.click(saveButton);

		expect(screen.getByText('too-long')).toBeInTheDocument();
	});

	test('clicks cancel button', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<EditItemModal
				wishlistId={mockWishlistData.id}
				opened={true}
				toggleModal={(): void => undefined}
				onAccept={(): void => undefined}
				item={mockWishlistData.wishlistItems[0]}
			/>
		);

		const cancelButton: HTMLElement = screen.getByRole('button', {
			name: /cancel/i
		});

		expect(cancelButton).toBeInTheDocument();
		await user.click(cancelButton);
	});

	test('updates inputs and priority on editingItem prop change', (): void => {
		const mockInputRefName = {current: {value: ''}};

		jest.spyOn(React, 'useRef').mockReturnValueOnce(mockInputRefName);

		const setPriority: jest.Mock = jest.fn();
		React.useState = jest.fn().mockReturnValue([1, setPriority]);

		render(
			<EditItemModal
				item={mockWishlistData.wishlistItems[0]}
				wishlistId={mockWishlistData.id}
				opened={true}
				onAccept={(): void => undefined}
				toggleModal={(): void => undefined}
			/>
		);

		expect(mockInputRefName.current.value).toBe(
			mockWishlistData.wishlistItems[0].name
		);
	});
});
