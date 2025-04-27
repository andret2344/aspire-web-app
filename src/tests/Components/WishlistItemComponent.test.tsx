import {mockedRemoveWishlistItem} from '../__mocks__/MockWishlistItemService';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';
import user from '@testing-library/user-event';
import React, {act} from 'react';
import {WishlistItemComponent} from '../../Components/WishlistItemComponent';
import {WishlistItem} from '../../Entity/WishlistItem';

describe('WishlistItemComponent', (): void => {
	const mockWishlistItem: WishlistItem = {
		id: 1,
		wishlistId: 1,
		name: 'Item 1',
		description: '# test description',
		priorityId: 2
	};

	const mockWishlistItemHidden: WishlistItem = {
		id: 1,
		wishlistId: 1,
		name: 'Item 1',
		description: 'test description',
		priorityId: 2,
		hidden: true
	};

	test('render correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItem}
				wishlistId={1}
				position={1}
				onEdit={jest.fn()}
				onRemove={jest.fn()}
			/>
		);

		// act
		const wishlistItemTitle: HTMLElement = screen.getByText('Item 1');

		// assert
		expect(wishlistItemTitle).toBeInTheDocument();
	});

	test('renders correctly hidden', (): void => {
		// arrange
		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItemHidden}
				wishlistId={1}
				position={1}
				onEdit={jest.fn()}
				onRemove={jest.fn()}
			/>
		);

		// act
		const wishlistItemTitle: HTMLElement = screen.getByText('Item 1');

		// assert
		expect(wishlistItemTitle).toBeInTheDocument();
	});

	test('handle item edit', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleEditButtonClick: jest.Mock = jest.fn();

		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItem}
				wishlistId={1}
				position={1}
				onEdit={handleEditButtonClick}
				onRemove={jest.fn()}
			/>
		);

		// act
		const editItemButton: HTMLElement =
			screen.getByTestId('edit-wishlist-item');
		await user.click(editItemButton);

		// assert
		expect(handleEditButtonClick).toHaveBeenCalledTimes(1);
		expect(handleEditButtonClick).toHaveBeenCalledWith(mockWishlistItem);
	});

	test('handle item row expands', async (): Promise<void> => {
		// arrange
		user.setup();

		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItem}
				wishlistId={1}
				position={1}
				onEdit={jest.fn()}
				onRemove={jest.fn()}
			/>
		);

		// act
		const itemRow: HTMLElement = screen.getByTestId('wishlist-item-row');
		await act(async (): Promise<void> => user.click(itemRow));

		// assert
		expect(screen.getByText('test description')).toBeInTheDocument();
	});

	test('handle remove item with success', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleRemoveButtonClick: jest.Mock = jest.fn();
		mockedRemoveWishlistItem.mockResolvedValue(mockWishlistItem);

		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItem}
				wishlistId={1}
				position={1}
				onEdit={jest.fn()}
				onRemove={handleRemoveButtonClick}
			/>
		);

		// act
		const removeItemButton: HTMLElement = screen.getByTestId(
			'remove-wishlist-item'
		);
		await user.click(removeItemButton);

		// assert
		expect(handleRemoveButtonClick).toHaveBeenCalledTimes(1);
		expect(handleRemoveButtonClick).toHaveBeenCalledWith(1, 1);
	});

	test('handle remove item edit with fail', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleEditButtonClick: jest.Mock = jest.fn();
		mockedRemoveWishlistItem.mockRejectedValue(void 0);

		renderForTest(
			<WishlistItemComponent
				item={mockWishlistItem}
				wishlistId={1}
				position={1}
				onEdit={jest.fn()}
				onRemove={handleEditButtonClick}
			/>
		);

		// act
		const removeItemButton: HTMLElement = screen.getByTestId(
			'remove-wishlist-item'
		);
		await user.click(removeItemButton);

		// assert
		expect(handleEditButtonClick).toHaveBeenCalledTimes(0);
		await waitFor((): void =>
			expect(screen.getByText('something-went-wrong')).toBeInTheDocument()
		);
	});
});
