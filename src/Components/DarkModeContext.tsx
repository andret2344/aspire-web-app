import React, {createContext, useContext} from 'react';
import {ThemeProvider} from '@mui/material/styles';
import {darkTheme, lightTheme} from '../Styles/theme';
import {None} from '../Types/None';

interface DarkModeContextType {
	readonly darkMode: boolean;
	readonly toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
	undefined
);

export const DarkModeProvider: React.FC<React.PropsWithChildren<None>> = (
	props: React.PropsWithChildren<None>
): React.ReactElement => {
	const [darkMode, setDarkMode] = React.useState<boolean>(
		localStorage.getItem('dark-mode') === 'true'
	);

	React.useEffect((): void => {
		localStorage.setItem('dark-mode', JSON.stringify(darkMode));
	}, [darkMode]);

	const toggleDarkMode = (): void => {
		setDarkMode((prev: boolean): boolean => !prev);
	};

	return (
		<DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
			<ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
				{props.children}
			</ThemeProvider>
		</DarkModeContext.Provider>
	);
};

export const useDarkMode = (): DarkModeContextType => {
	const context = useContext(DarkModeContext);
	if (!context) {
		throw new Error('useDarkMode must be used within a DarkModeProvider');
	}
	return context;
};
