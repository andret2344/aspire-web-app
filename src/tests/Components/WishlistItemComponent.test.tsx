import {mockedRemoveWishlistItem} from '../__mocks__/MockWishlistItemService';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../__utils__/RenderForTest';
import user from '@testing-library/user-event';
import React from 'react';
import {WishlistItemComponent} from '../../main/Components/WishlistItemComponent';
import {getSampleWishlistItem} from '../__utils__/DataFactory';

describe('WishlistItemComponent', (): void => {
	it('renders without edit handler', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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

	it('renders without visibility handler', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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

	it('renders no visibility icons when loading', async (): Promise<void> => {
		// arrange
		user.setup();
		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem({hidden: true})}
				wishlistId={1}
				position={1}
				loadingVisibility={true}
				onEdit={(): void => undefined}
				onItemUpdate={(): void => undefined}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const iconVisible: HTMLElement | null =
			screen.queryByTestId('item-visible-icon');
		const iconHidden: HTMLElement | null =
			screen.queryByTestId('item-hidden-icon');

		// assert
		expect(iconVisible).toBeNull();
		expect(iconHidden).toBeNull();
	});

	it('handles hide item', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleVisibilityClick: jest.Mock = jest.fn();
		renderForTest(
			<WishlistItemComponent
				canBeHidden={true}
				item={getSampleWishlistItem()}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
				onEdit={(): void => undefined}
				onItemUpdate={handleVisibilityClick}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const iconHidden: HTMLElement = screen.getByTestId('item-visible-icon');
		await user.click(iconHidden);
		const wishlistItemDescription: HTMLElement | null =
			screen.queryByText('test description');

		// assert
		expect(wishlistItemDescription).toBeNull();
		expect(handleVisibilityClick).toHaveBeenCalledTimes(1);
		expect(handleVisibilityClick).toHaveBeenCalledWith(1, {hidden: true});
	});

	it('handles show item', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleVisibilityClick: jest.Mock = jest.fn();
		renderForTest(
			<WishlistItemComponent
				canBeHidden={true}
				item={getSampleWishlistItem({hidden: true})}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
				onEdit={(): void => undefined}
				onItemUpdate={handleVisibilityClick}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const iconHidden: HTMLElement = screen.getByTestId('item-hidden-icon');
		await user.click(iconHidden);
		const wishlistItemDescription: HTMLElement | null =
			screen.queryByText('test description');

		// assert
		expect(wishlistItemDescription).toBeNull();
		expect(handleVisibilityClick).toHaveBeenCalledTimes(1);
		expect(handleVisibilityClick).toHaveBeenCalledWith(1, {hidden: false});
	});

	it('handles visibility icon click to expand the description', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleVisibilityClick: jest.Mock = jest.fn();
		renderForTest(
			<WishlistItemComponent
				canBeHidden={false}
				item={getSampleWishlistItem({hidden: true})}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
				onEdit={(): void => undefined}
				onItemUpdate={handleVisibilityClick}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const iconHidden: HTMLElement = screen.getByTestId('item-hidden-icon');
		await user.click(iconHidden);
		const wishlistItemDescription: HTMLElement =
			screen.getByText('Item description');

		// assert
		expect(wishlistItemDescription).toBeInTheDocument();
		expect(handleVisibilityClick).toHaveBeenCalledTimes(0);
	});

	it('handles item edit', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleEditButtonClick: jest.Mock = jest.fn();

		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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
				wishlistId={1}
				position={1}
				loadingVisibility={false}
				onEdit={(): void => undefined}
				onRemove={(): void => undefined}
			/>
		);

		// act
		const itemRow: HTMLElement = screen.getByTestId(
			'wishlist-item-row-grid'
		);
		await user.click(itemRow);
		const descriptionElement: HTMLElement =
			screen.getByText('Item description');

		// assert
		expect(descriptionElement).toBeInTheDocument();
	});

	it('handles remove item with success', async (): Promise<void> => {
		// arrange
		user.setup();
		const handleRemoveButtonClick: jest.Mock = jest.fn();
		mockedRemoveWishlistItem.mockResolvedValue(void 0);

		renderForTest(
			<WishlistItemComponent
				item={getSampleWishlistItem()}
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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
				wishlistId={1}
				position={1}
				loadingVisibility={false}
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
			expect(screen.getByText('something-went-wrong')).toBeInTheDocument()
		);
	});
});
