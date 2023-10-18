export interface WishList {
	readonly id: number;
	readonly uuid: string;
	readonly name: string;
}

export const wishLists: WishList[] = [
	{
		id: 1,
		uuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
		name: 'Książki do przeczytania',
	},
	{
		id: 2,
		uuid: 'e61c6f7f-10e4-416f-bf1f-9c7e4e6a586a',
		name: 'Gry na PC',
	},
	{
		id: 3,
		uuid: 'd3dc53df-8f8b-4019-8c65-8f7f630e9a3b',
		name: 'Podróże marzeń',
	},
	{
		id: 4,
		uuid: 'be6db1d7-8b7e-4427-a6a6-5aef327cb156',
		name: 'Przepisy do wypróbowania',
	},
	{
		id: 5,
		uuid: 'a27acd0e-3ae1-4a64-af2e-8d73d1c6f8cb',
		name: 'Zakupy do domu',
	},
];
