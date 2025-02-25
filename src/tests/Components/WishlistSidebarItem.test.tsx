import {mockedUpdateWishlistName} from '../__mocks__/MockWishlistService';
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
		has_password: false
	};

	test('render correctly', (): void => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={false}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
				onPasswordEnter={jest.fn()}
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
				onPasswordEnter={jest.fn()}
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
				onPasswordEnter={jest.fn()}
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
				onPasswordEnter={jest.fn()}
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

	test('visiblity button works correctly', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={jest.fn()}
				onNameEdit={jest.fn()}
				onPasswordEnter={jest.fn()}
			/>
		);
		//act
		await user.click(screen.getByTestId('hidden-items-icon-button'));

		// assert
		expect(
			screen.getByText('Set password for this wishlist')
		).toBeInTheDocument();
	});
});
