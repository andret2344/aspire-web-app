import {
	mockedRemoveWishlistItem,
	mockedUpdateWishlistItem
} from '../__mocks__/MockWishlistItemService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../__utils__/RenderForTest';
import user from '@testing-library/user-event';
import React from 'react';
import {WishlistItemComponent} from '../../main/Components/WishlistItemComponent';
import {
	getSampleWishlist,
	getSampleWishlistItem
} from '../__utils__/DataFactory';

describe('WishlistItemComponent', (): void => {
	it('opens and closes menu on small width', async (): Promise<void> => {
		mockedUseMediaQuery.mockReturnValue(true);
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onRemove={(): void => undefined}
			/>
		);
		const buttonMore: HTMLElement = screen.getByTestId(
			'wishlist-item-button-more'
		);

		// act
		await user.click(buttonMore);

		// assert
		const menuItemRemove: HTMLElement =
			screen.getByTestId('menu-item-remove');
		expect(menuItemRemove).toBeInTheDocument();
	});

	describe('edit and delete', (): void => {
		it('renders without edit handler', async (): Promise<void> => {
			// arrange
			user.setup();
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const iconEdit: HTMLElement | null = screen.queryByTestId(
				'edit-wishlist-item-1-1'
			);
			const iconRemove: HTMLElement | null = screen.queryByTestId(
				'remove-wishlist-item-1-1'
			);

			// assert
			expect(iconEdit).toBeNull();
			expect(iconRemove).not.toBeNull();
		});

		it('renders without remove handler', async (): Promise<void> => {
			// arrange
			user.setup();
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
				/>
			);

			// act
			const iconEdit: HTMLElement | null = screen.queryByTestId(
				'edit-wishlist-item-1-1'
			);
			const iconRemove: HTMLElement | null = screen.queryByTestId(
				'remove-wishlist-item-1-1'
			);

			// assert
			expect(iconEdit).not.toBeNull();
			expect(iconRemove).toBeNull();
		});

		it('renders without action handlers', async (): Promise<void> => {
			// arrange
			user.setup();
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
				/>
			);

			// act
			const iconEdit: HTMLElement | null = screen.queryByTestId(
				'edit-wishlist-item-1-1'
			);
			const iconRemove: HTMLElement | null = screen.queryByTestId(
				'remove-wishlist-item-1-1'
			);

			// assert
			expect(iconEdit).toBeNull();
			expect(iconRemove).toBeNull();
		});

		it('handles remove item with success', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleRemoveButtonClick: jest.Mock = jest.fn();
			mockedRemoveWishlistItem.mockResolvedValue(void 0);

			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onRemove={handleRemoveButtonClick}
				/>
			);

			// act
			const removeItemButton: HTMLElement = screen.getByTestId(
				'remove-wishlist-item-1-1'
			);
			await user.click(removeItemButton);

			// assert
			expect(handleRemoveButtonClick).toHaveBeenCalledTimes(1);
			expect(handleRemoveButtonClick).toHaveBeenCalledWith(1, 1);
		});

		it('handles remove item edit with fail', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleEditButtonClick: jest.Mock = jest.fn();
			mockedRemoveWishlistItem.mockRejectedValue(void 0);

			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onRemove={handleEditButtonClick}
				/>
			);

			// act
			const removeItemButton: HTMLElement = screen.getByTestId(
				'remove-wishlist-item-1-1'
			);
			await user.click(removeItemButton);

			// assert
			expect(handleEditButtonClick).toHaveBeenCalledTimes(0);
			await waitFor((): void =>
				expect(
					screen.getByText('something-went-wrong')
				).toBeInTheDocument()
			);
		});
	});

	describe('visibility', (): void => {
		it('renders without inline edit handler', async (): Promise<void> => {
			// arrange
			user.setup();
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const progress: HTMLElement | null = screen.queryByTestId(
				'item-loading-progress'
			);
			const iconHidden: HTMLElement | null =
				screen.queryByTestId('item-hidden-icon');
			const iconVisible: HTMLElement | null =
				screen.queryByTestId('item-visible-icon');

			// assert
			expect(progress).toBeNull();
			expect(iconHidden).toBeNull();
			expect(iconVisible).toBeNull();
		});

		it('handles hide item', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist({hasPassword: true})}
					position={1}
					onEdit={(): void => undefined}
					onEdit={handleWishlistEditClick}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const iconHidden: HTMLElement =
				screen.getByTestId('item-visible-icon');
			await user.click(iconHidden);
			const wishlistItemDescription: HTMLElement | null =
				screen.queryByText('test description');

			// assert
			expect(wishlistItemDescription).toBeNull();
			expect(handleWishlistEditClick).toHaveBeenCalledTimes(1);
			expect(handleWishlistEditClick).toHaveBeenCalledWith(
				getSampleWishlist({
					hasPassword: true,
					wishlistItems: [getSampleWishlistItem({hidden: true})]
				})
			);
		});

		it('handles show item', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem({hidden: true})}
					wishlist={getSampleWishlist({hasPassword: true})}
					position={1}
					onEdit={(): void => undefined}
					onEdit={handleWishlistEditClick}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const iconHidden: HTMLElement =
				screen.getByTestId('item-hidden-icon');
			await user.click(iconHidden);
			const wishlistItemDescription: HTMLElement | null =
				screen.queryByText('test description');

			// assert
			expect(wishlistItemDescription).toBeNull();
			expect(handleWishlistEditClick).toHaveBeenCalledTimes(1);
			expect(handleWishlistEditClick).toHaveBeenCalledWith(
				getSampleWishlist({
					hasPassword: true,
					wishlistItems: [getSampleWishlistItem({hidden: false})]
				})
			);
		});

		it('handles visibility icon click to expand the description', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onEdit={handleWishlistEditClick}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const iconVisible: HTMLElement =
				screen.getByTestId('item-visible-icon');
			await user.click(iconVisible);
			const wishlistItemDescription: HTMLElement =
				screen.getByText('Item description');

			// assert
			expect(wishlistItemDescription).toBeInTheDocument();
			expect(handleWishlistEditClick).toHaveBeenCalledTimes(0);
		});
	});

	describe('priority', (): void => {
		it('handles priority change', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onEdit={handleWishlistEditClick}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const priorityChip: HTMLElement =
				screen.getByTestId('item-priority-chip');
			await user.click(priorityChip);
			const priorityMenuItem: HTMLElement = screen.getByTestId(
				'priority-menu-item-2'
			);
			await user.click(priorityMenuItem);
			const wishlistItemDescription: HTMLElement | null =
				screen.queryByText('Item description');

			// assert
			expect(wishlistItemDescription).toBeNull();
			expect(handleWishlistEditClick).toHaveBeenCalledTimes(1);
			expect(handleWishlistEditClick).toHaveBeenCalledWith(
				getSampleWishlist({
					wishlistItems: [getSampleWishlistItem({priorityId: 2})]
				})
			);
		});

		it('handles row expand without wishlist edit handler', async (): Promise<void> => {
			// arrange
			user.setup();
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
					onRemove={(): void => undefined}
				/>
			);

			// act
			const priorityChip: HTMLElement =
				screen.getByTestId('item-priority-chip');
			await user.click(priorityChip);
			const wishlistItemDescription: HTMLElement =
				screen.getByText('Item description');

			// assert
			expect(wishlistItemDescription).toBeInTheDocument();
			expect(handleWishlistEditClick).toHaveBeenCalledTimes(0);
		});
	});

	it('handles item edit', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleEditButtonClick: jest.Mock = jest.fn();

		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onEdit={handleEditButtonClick}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const editItemButton: HTMLElement = screen.getByTestId(
			'edit-wishlist-item-1-1'
		);
		await user.click(editItemButton);

		// assert
		expect(handleEditButtonClick).toHaveBeenCalledTimes(1);
		expect(handleEditButtonClick).toHaveBeenCalledWith(
			getSampleWishlistItem()
		);
	});

	it('handles item row expands', async (): Promise<void> => {
		// arrange
		user.setup();

		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onEdit={(): void => undefined}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const itemRow: HTMLElement = screen.getByTestId(
			'wishlist-item-row-grid-1-1'
		);
		await user.click(itemRow);
		const descriptionElement: HTMLElement =
			screen.getByText('Item description');

		// assert
		expect(descriptionElement).toBeInTheDocument();
	});
});
