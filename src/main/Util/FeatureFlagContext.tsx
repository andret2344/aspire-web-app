import React, {
	Context,
	createContext,
	PropsWithChildren,
	useContext
} from 'react';
import {None} from '@type/None';

export type FeatureFlags = {
	readonly wishlistSettings: boolean;
};

export const featureFlags: FeatureFlags = {
	wishlistSettings: process.env.REACT_APP_FEATURE_WISHLIST_SETTINGS === 'true'
};

const FeatureFlagsContext: Context<FeatureFlags> = createContext(featureFlags);

export function useFeatureFlags(): FeatureFlags {
	return useContext(FeatureFlagsContext);
}

export function FeatureFlagsProvider(
	props: React.PropsWithChildren<None>
): React.ReactElement {
	return (
		<FeatureFlagsContext.Provider value={featureFlags}>
			{props.children}
		</FeatureFlagsContext.Provider>
	);
}

interface FeatureFlagProps {
	readonly flag: keyof FeatureFlags;
	readonly fallback?: React.ReactElement;
}

export function FeatureFlag(
	props: PropsWithChildren<FeatureFlagProps>
): React.ReactElement {
	const flags: FeatureFlags = useFeatureFlags();
	console.log(flags);
	return flags[props.flag] ? <>{props.children}</> : <>{props.fallback}</>;
}
