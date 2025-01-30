import {WishlistSidebarItem} from '../../Components/WishlistSidebarItem';
import {WishList} from '../../Entity/WishList';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';

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
		]
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
});
