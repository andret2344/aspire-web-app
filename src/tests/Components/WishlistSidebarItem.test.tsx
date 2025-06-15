import {
	mockedSetWishlistPassword,
	mockedUpdateWishlistName
} from '../__mocks__/MockWishlistService';
import {WishlistSidebarItem} from '../../main/Components/WishlistSidebarItem';
import {WishList} from '../../main/Entity/WishList';
import {screen, waitFor} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../__utils__/RenderForTest';
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

	it('renders correctly without password', (): void => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={false}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	it('renders correctly with password', (): void => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistDataWithPassword}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		// act
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});

	it('handles name change with success', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		mockedUpdateWishlistName.mockResolvedValue(mockWishlistData);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={handleNameChange}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		const doneButton: HTMLElement =
			screen.getByTestId('wishlist-edit-done');

		// act
		await user.clear(input);
		await user.type(input, 'New Mock Wishlist');
		await user.click(doneButton);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(1);
		expect(handleNameChange).toHaveBeenCalledWith('New Mock Wishlist');
		await waitFor(async (): Promise<void> => {
			expect(screen.getByText('wishlist-renamed')).toBeInTheDocument();
		});
	});

	it('handles name change with empty name', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		mockedUpdateWishlistName.mockResolvedValue(mockWishlistData);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={handleNameChange}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		const doneButton: HTMLElement =
			screen.getByTestId('wishlist-edit-done');

		// act
		await user.clear(input);
		await user.click(doneButton);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(0);
	});

	it('handles name change with failure', async (): Promise<void> => {
		// arrange
		const handleNameChange: jest.Mock = jest.fn();
		mockedUpdateWishlistName.mockRejectedValue(void 0);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={handleNameChange}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('edit-icon'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-edit-name-input')
			.querySelector('input') as HTMLInputElement;
		const doneButton: HTMLElement =
			screen.getByTestId('wishlist-edit-done');

		// act
		await user.type(input, 'Mock Wishlist');
		await user.click(doneButton);

		// assert
		expect(handleNameChange).toHaveBeenCalledTimes(0);
		await waitFor(async (): Promise<void> => {
			expect(
				screen.getByText('something-went-wrong')
			).toBeInTheDocument();
		});
	});

	it('renders warning when trying to hide item', async (): Promise<void> => {
		// arrange
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);
		const hiddenItemsButton: HTMLElement = screen.getByTestId(
			'hidden-items-icon-button'
		);

		// act
		await user.click(hiddenItemsButton);

		// assert
		expect(screen.getByText('set-wishlist-password')).toBeInTheDocument();
	});

	it('closes opened set password modal', async (): Promise<void> => {
		// arrange
		mockedSetWishlistPassword.mockResolvedValue(null);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('hidden-items-icon-button'));

		// act
		await user.click(screen.getByTestId('wishlist-password-modal-cancel'));

		// assert
		expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(0);
	});

	it('handles password setting', async (): Promise<void> => {
		// arrange
		mockedSetWishlistPassword.mockResolvedValue(null);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
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
		expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
		expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, 'password');
	});

	it('handles password clearing with success', async (): Promise<void> => {
		// arrange
		mockedSetWishlistPassword.mockResolvedValue(null);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistDataWithPassword}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('hidden-items-icon-button'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLInputElement;

		await user.type(input, 'password');

		// act
		await user.click(screen.getByTestId('wishlist-password-modal-clear'));

		// assert
		expect(screen.getByText('password-cleared')).toBeInTheDocument();
		expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
		expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, '');
	});

	it('handles password clearing with failure', async (): Promise<void> => {
		// arrange
		mockedSetWishlistPassword.mockRejectedValue(null);
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistDataWithPassword}
				active={true}
				onRemove={(): void => undefined}
				onNameEdit={(): void => undefined}
				onPasswordChange={(): void => undefined}
			/>
		);

		await user.click(screen.getByTestId('hidden-items-icon-button'));

		const input: HTMLInputElement = screen
			.getByTestId('wishlist-password-modal-input')
			.querySelector('input') as HTMLInputElement;

		await user.type(input, 'password');

		// act
		await user.click(screen.getByTestId('wishlist-password-modal-clear'));

		// assert
		expect(screen.getByText('something-went-wrong')).toBeInTheDocument();
		expect(mockedSetWishlistPassword).toHaveBeenCalledTimes(1);
		expect(mockedSetWishlistPassword).toHaveBeenCalledWith(1, '');
	});
});
