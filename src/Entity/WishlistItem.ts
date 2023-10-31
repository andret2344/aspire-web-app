export interface WishlistItem {
	readonly id: number;
	readonly wishlistId: number;
	readonly name: string;
	readonly description: string;
	readonly priorityId: number;
}

export const firstWishlistItems: WishlistItem[] = [
	{
		id: 1,
		wishlistId: 1,
		name: 'Papier toaletowy',
		description: 'KONIECZNIE',
		priorityId: 1
	},
	{
		id: 2,
		wishlistId: 1,
		name: 'Posciel',
		description: '220x200',
		priorityId: 2
	},
	{
		id: 3,
		wishlistId: 1,
		name: 'Wyjazd na mecz',
		description:
			'Musze sie jeszcze nad tym zastanowic, to bardzo duzy wydatek',
		priorityId: 3
	}
];
