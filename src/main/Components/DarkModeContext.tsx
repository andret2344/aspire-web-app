import React, {Context, createContext, useContext} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {darkTheme, lightTheme} from '@utils/theme';
import {None} from '@types/None';

interface DarkModeContextType {
	readonly darkMode: boolean;
	readonly toggleDarkMode: () => void;
}

export const DarkModeContext: Context<DarkModeContextType | undefined> =
	createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider(
	props: React.PropsWithChildren<None>
): React.ReactElement {
	const [darkMode, setDarkMode] = React.useState<boolean>(
		localStorage.getItem('dark-mode') === 'true'
	);

	React.useEffect((): void => {
		localStorage.setItem('dark-mode', JSON.stringify(darkMode));
	}, [darkMode]);

	function toggleDarkMode(): void {
		setDarkMode((prev: boolean): boolean => !prev);
	}

	return (
		<DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
			<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
				{props.children}
			</ThemeProvider>
		</DarkModeContext.Provider>
	);
}

export function useDarkMode(): DarkModeContextType {
	const context: DarkModeContextType | undefined =
		useContext(DarkModeContext);
	if (!context) {
		throw new Error('useDarkMode must be used within a DarkModeProvider');
	}
	return context;
}
