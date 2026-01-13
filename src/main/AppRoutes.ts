export const appPaths = {
	login: '/',
	register: '/register',
	resetPassword: '/reset-password',
	newPassword: '/new-password/:token',

	wishlists: '/wishlists',
	wishlist: '/wishlists/:id',
	profile: '/profile',

	readonlyWishlist: '/wishlist/:id',
	confirmEmail: '/confirm/:token',

	error: '/error',

	notFound: '*'
} as const;
