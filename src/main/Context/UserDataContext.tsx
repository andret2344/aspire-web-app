import React, {Context} from 'react';
import {mapFromResponse, UserData, UserDataResponse} from '@entity/UserData';
import {getUserData} from '@service/AuthService';

type State = {
	user: UserData | null;
	loaded: boolean;
};

type Actions = {
	setUser: (userData: UserData | null) => void;
	setLoaded: (loaded: boolean) => void;
	refreshUser: () => Promise<void>;
};

const stateContext: Context<State | null> = React.createContext<State | null>(null);
const actionsContext: Context<Actions | null> = React.createContext<Actions | null>(null);

export function UserDataProvider(props: Readonly<React.PropsWithChildren>): React.ReactElement {
	const [user, setUser] = React.useState<UserData | null>(null);
	const [loaded, setLoaded] = React.useState<boolean>(false);

	const refreshUser: () => Promise<void> = React.useCallback(async (): Promise<void> => {
		const response: UserDataResponse = await getUserData();
		const mapped: UserData = mapFromResponse(response);
		setUser(mapped);
	}, []);

	const state = React.useMemo(() => ({user, loaded}), [user, loaded]);
	const actions: Actions = React.useMemo<Actions>(() => ({setUser, setLoaded, refreshUser}), [refreshUser]);

	return (
		<stateContext.Provider value={state}>
			<actionsContext.Provider value={actions}>{props.children}</actionsContext.Provider>
		</stateContext.Provider>
	);
}

export function useUserData(): State {
	const ctx: State | null = React.useContext(stateContext);
	if (!ctx) {
		throw new Error('useUserData must be used within <UserDataProvider>');
	}
	return ctx;
}

export function useUserDataActions(): Actions {
	const ctx: Actions | null = React.useContext(actionsContext);
	if (!ctx) {
		throw new Error('useUserDataActions must be used within <UserDataProvider>');
	}
	return ctx;
}
