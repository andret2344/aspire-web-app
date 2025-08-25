import React, {Context} from 'react';
import {render, screen} from '@testing-library/react';
import {
	FeatureFlag,
	FeatureFlags,
	FeatureFlagsProvider,
	useFeatureFlags
} from '@util/FeatureFlagContext';

describe('FeatureFlags', (): void => {
	function renderWithProvider(
		ui: React.ReactElement,
		flags: FeatureFlags
	): void {
		const FeatureFlagsContext: Context<FeatureFlags> =
			React.createContext(flags);

		render(
			<FeatureFlagsContext.Provider value={flags}>
				{ui}
			</FeatureFlagsContext.Provider>
		);
	}

	test('useFeatureFlags returns correct context value', (): void => {
		function TestComponent(): React.ReactElement {
			const flags: FeatureFlags = useFeatureFlags();
			console.log(flags);
			return <div>Flag: {flags.wishlistSettings ? 'on' : 'off'}</div>;
		}

		renderWithProvider(<TestComponent />, {wishlistSettings: true});
		expect(screen.getByText('Flag: on')).toBeInTheDocument();
	});

	test('FeatureFlag renders children if flag is true', (): void => {
		renderWithProvider(
			<FeatureFlag flag='wishlistSettings'>
				<div>Feature is ON</div>
			</FeatureFlag>,
			{wishlistSettings: true}
		);

		expect(screen.getByText('Feature is ON')).toBeInTheDocument();
	});

	test('FeatureFlag renders fallback if flag is false', (): void => {
		renderWithProvider(
			<FeatureFlag
				flag='wishlistSettings'
				fallback={<div>Fallback content</div>}
			>
				<div>Feature is ON</div>
			</FeatureFlag>,
			{wishlistSettings: false}
		);

		expect(screen.getByText('Fallback content')).toBeInTheDocument();
	});

	test('FeatureFlagsProvider provides default flags', (): void => {
		function TestComponent(): React.ReactElement {
			const flags: FeatureFlags = useFeatureFlags();
			return (
				<div>
					Default flag: {flags.wishlistSettings ? 'true' : 'false'}
				</div>
			);
		}

		render(
			<FeatureFlagsProvider>
				<TestComponent />
			</FeatureFlagsProvider>
		);

		const expected =
			process.env.REACT_APP_FEATURE_WISHLIST_SETTINGS === 'true'
				? 'true'
				: 'false';

		expect(
			screen.getByText(`Default flag: ${expected}`)
		).toBeInTheDocument();
	});
});
