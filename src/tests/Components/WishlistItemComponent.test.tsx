import {
	mockedRemoveWishlistItem,
	mockedUpdateWishlistItem
} from '../__mocks__/MockWishlistItemService';
import {mockedUseMediaQuery} from '../__mocks__/MockMaterialUI';
import {mockedGetMarkdown} from '../__mocks__/MockMDXEditor';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../__utils__/RenderForTest';
import user from '@testing-library/user-event';
import React from 'react';
import {WishlistItemComponent} from '@component/WishlistItemComponent';
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
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={(): void => undefined}
				/>
			);

			// act
			const iconEdit: HTMLElement = screen.getByTestId(
				'editable-name-button-edit'
			);
			const iconRemove: HTMLElement | null = screen.queryByTestId(
				'remove-wishlist-item-1-1'
			);

			// assert
			expect(iconEdit).toBeInTheDocument();
			expect(iconRemove).toBeNull();
		});

		it('renders without action handlers', async (): Promise<void> => {
			// arrange
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
			expect(handleRemoveButtonClick).toHaveBeenCalledWith(1);
		});

		it('handles remove item edit with fail', async (): Promise<void> => {
			// arrange
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
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
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
			const handleEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist({hasPassword: true})}
					position={1}
					onEdit={handleEditClick}
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
			expect(handleEditClick).toHaveBeenCalledTimes(1);
			expect(handleEditClick).toHaveBeenCalledWith(
				getSampleWishlistItem({hidden: true})
			);
		});

		it('handles show item', async (): Promise<void> => {
			// arrange
			const handleEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem({hidden: true})}
					wishlist={getSampleWishlist({hasPassword: true})}
					position={1}
					onEdit={handleEditClick}
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
			expect(handleEditClick).toHaveBeenCalledTimes(1);
			expect(handleEditClick).toHaveBeenCalledWith(
				getSampleWishlistItem({hidden: false})
			);
		});

		it('handles visibility icon click to expand the description', async (): Promise<void> => {
			// arrange
			const handleEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={handleEditClick}
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
			expect(handleEditClick).toHaveBeenCalledTimes(0);
		});
	});

	describe('priority', (): void => {
		it('handles priority change', async (): Promise<void> => {
			// arrange
			const handleEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
					onEdit={handleEditClick}
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
			expect(handleEditClick).toHaveBeenCalledTimes(1);
			expect(handleEditClick).toHaveBeenCalledWith(
				getSampleWishlistItem({priority: 2})
			);
		});

		it('handles row expand without wishlist edit handler', async (): Promise<void> => {
			// arrange
			const handleWishlistEditClick: jest.Mock = jest.fn();
			mockedUpdateWishlistItem.mockResolvedValue(void 0);
			renderForTest(
				<WishlistItemComponent
					item={getSampleWishlistItem()}
					wishlist={getSampleWishlist()}
					position={1}
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

	it('handles name edit', async (): Promise<void> => {
		// arrange
		const handleEdit: jest.Mock = jest.fn();
		mockedUpdateWishlistItem.mockResolvedValue(void 0);
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onEdit={handleEdit}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const editButton: HTMLElement = screen.getByTestId(
			'editable-name-button-edit'
		);
		await user.click(editButton);
		const inputWrapper: HTMLElement = screen.getByTestId(
			'editable-name-input-name'
		);
		const input: HTMLInputElement = inputWrapper.querySelector(
			'input'
		) as HTMLInputElement;
		await user.clear(input);
		await user.type(input, 'New description');
		const doneButton: HTMLElement = screen.getByTestId(
			'editable-name-button-done'
		);
		await user.click(doneButton);

		// assert
		expect(handleEdit).toHaveBeenCalledTimes(1);
		expect(handleEdit).toHaveBeenCalledWith(
			getSampleWishlistItem({
				name: 'New description'
			})
		);
	});

	it('handles description edit', async (): Promise<void> => {
		// arrange
		const handleEdit: jest.Mock = jest.fn();
		mockedGetMarkdown.mockReturnValue('<p>New description</p>');
		mockedUpdateWishlistItem.mockResolvedValue(void 0);
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onEdit={handleEdit}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const itemRow: HTMLElement = screen.getByTestId(
			'wishlist-item-row-grid-1-1'
		);
		await user.click(itemRow);
		const editDescriptionButton: HTMLElement = screen.getByTestId(
			'component-wishlist-item-1-button-edit-description'
		);
		await user.click(editDescriptionButton);
		const buttonAccept: HTMLElement = screen.getByTestId(
			'modal-description-confirm'
		);
		await user.click(buttonAccept);

		// assert
		expect(handleEdit).toHaveBeenCalledTimes(1);
		expect(handleEdit).toHaveBeenCalledWith(
			getSampleWishlistItem({
				description: '<p>New description</p>'
			})
		);
	});

	it('handles item row expands', async (): Promise<void> => {
		// arrange
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

	it('handles duplicate', async (): Promise<void> => {
		// arrange
		const handleDuplicateClick: jest.Mock = jest.fn();
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlist={getSampleWishlist()}
				position={1}
				onDuplicate={handleDuplicateClick}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const menuItem: HTMLElement = screen.getByTestId(
			'wishlist-item-button-more'
		);
		await user.click(menuItem);
		const duplicateChip: HTMLElement = screen.getByTestId(
			'menu-item-duplicate'
		);
		await user.click(duplicateChip);

		// assert
		expect(handleDuplicateClick).toHaveBeenCalledTimes(1);
		expect(handleDuplicateClick).toHaveBeenCalledWith(
			getSampleWishlistItem()
		);
	});
});
