import {WishlistSidebarItem} from '../../Components/WishlistSidebarItem';
import {WishList} from '../../Entity/WishList';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {renderForTest} from '../Utils/RenderForTest';
import {mockedGetWishlistHiddenItems} from '../__mocks__/MockWishlistItemService';

describe('WishlistSidebarItem', (): void => {
	beforeEach((): void => localStorage.clear());

	const mockedOnShare: jest.Mock = jest.fn();

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
				priorityId: 3,
				hidden: false
			}
		],
		has_hidden_items: false
	};

	test('render correctly', (): void => {
		// arrange && act
		renderForTest(
			<WishlistSidebarItem
				wishlist={mockWishlistData}
				active={false}
				onShare={mockedOnShare}
				onRemove={mockedOnShare}
				onDisplay={mockedOnShare}
				getWishlistHiddenItems={mockedGetWishlistHiddenItems}
			/>
		);
		const wishlistTitle: HTMLElement = screen.getByText('Mock Wishlist');

		// assert
		expect(wishlistTitle).toBeInTheDocument();
	});
});
