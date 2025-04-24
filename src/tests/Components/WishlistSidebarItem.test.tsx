import {
	mockedSetWishlistPassword,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {WishlistSidebarItem} from '../../Components/WishlistSidebarItem';
import {WishList} from '../../Entity/WishList';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';
import {act, fireEvent} from '@testing-library/react';
import user from '@testing-library/user-event';

describe('WishlistSidebarItem', (): void => {
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
		],
		hasPassword: false
	};

	const mockWishlistDataWithPassword: WishList = {
		id: 1,
		uuid: 'random uuid',
		name: 'Mock Wishlist',
		wishlistItems: [
			{
				id: 1,
				wishlistId: 1,
				description: 'test description',
				name: 'Item 1',
				priorityId: 3,
				hidden: true
			}
		],
		hasPassword: true
	};

	test('render correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={false}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	test('renders correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistDataWithPassword}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	test('handle name change with success', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		mockedUpdateWishlistName.mockResolvedValue(mockWishlistData);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={handleNameChange}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		await act((): boolean =>
			fireEvent.change(input, {target: {value: 'New Mock Wishlist'}})
		);

		// act
		await act(
			async (): Promise<void> =>
				user.click(screen.getByTestId('wishlist-edit-done'))
		);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(1);
		expect(handleNameChange).toHaveBeenCalledWith('New Mock Wishlist');
		await waitFor(async (): Promise<void> => {
			expect(screen.getByText('wishlist-renamed')).toBeInTheDocument();
		});
	});

	test('handle name change with fail', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		mockedUpdateWishlistName.mockRejectedValue(void 0);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={handleNameChange}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		await act((): boolean =>
			fireEvent.change(input, {target: {value: 'Mock Wishlist'}})
		);

		// act
		await act(
			async (): Promise<void> =>
				user.click(screen.getByTestId('wishlist-edit-done'))
		);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(0);
		await waitFor(async (): Promise<void> => {
			expect(
				screen.getByText('something-went-wrong')
			).toBeInTheDocument();
		});
	});

	test('handle name change with empty name', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={handleNameChange}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		await act((): boolean =>
			fireEvent.change(input, {target: {value: ''}})
		);

		// act
		await act(
			async (): Promise<void> =>
				user.click(screen.getByTestId('wishlist-edit-done'))
		);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(0);
	});

	test('visibility button works correctly', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
			/>
		);

		// act
		await user.click(screen.getByTestId('hidden-items-icon-button'));

		// assert
		expect(screen.getByText('set-wishlist-password')).toBeInTheDocument();
	});

	it('closes opened set password modal', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
			/>
		);

		await user.click(screen.getByTestId('hidden-items-icon-button'));

		// act
		await user.click(screen.getByTestId('wishlist-password-modal-cancel'));

		// assert
		expect(screen.queryByText('set-wishlist-password')).toBeNull();
	});

	it('handles password setting', async (): Promise<void> => {
		// arrange
		mockedSetWishlistPassword.mockResolvedValue(null);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
			/>
		);

		await user.click(screen.getByTestId('hidden-items-icon-button'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLInputElement;

		await user.type(input, 'password');

		// act
		await user.click(screen.getByTestId('wishlist-password-modal-confirm'));

		// assert
		expect(screen.getByText('password-changed')).toBeInTheDocument();
		expect(screen.queryByText('set-wishlist-password')).toBeNull();
	});
});
