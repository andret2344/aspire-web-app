import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';
import user from '@testing-library/user-event';
import React from 'react';
import {WishlistItemComponent} from '../../Components/WishlistItemComponent';
import {WishlistItem} from '../../Entity/WishlistItem';

describe('WishlistItemComponent', (): void => {
	const mockWishlistItem: WishlistItem = {
		id: 1,
		wishlistId: 1,
		description: 'test description',
		name: 'Item 1',
		priorityId: 2
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

	test('remove wishlist item correctly', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleRemoveButtonClick: jest.Mock = jest.fn();

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

	test('remove handle item edit', async (): Promise<void> => {
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
});
