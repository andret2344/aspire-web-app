import {createTheme, Theme} from '@mui/material';

const PRIORITY_COLOR_HIGH = 'rgba(255, 99, 71, 1)';
const PRIORITY_COLOR_MEDIUM = 'rgba(255, 255, 0, 1)';
const PRIORITY_COLOR_LOW = 'rgba(0, 255, 0, 1)';

const priorityColors: {[key: number]: string} = {
	1: PRIORITY_COLOR_HIGH,
	2: PRIORITY_COLOR_MEDIUM,
	3: PRIORITY_COLOR_LOW
};

interface Colors {
	blue: string;
	lightBlue?: string;
	activeBlue?: string;
	red: string;
}

const lightColors: Colors = {
	blue: 'rgba(0, 109, 209, 0.17)',
	red: '#670303',
	lightBlue: '#D9E6F7',
	activeBlue: 'rgba(0, 109, 209, 0.4)'
};

const darkColors: Colors = {
	blue: '#026DD1',
	red: '#e08888',
	lightBlue: 'rgba(0, 109, 209, 0.4)',
	activeBlue: 'rgba(0, 109, 209, 0.4)'
};

export const lightTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#026DD1'
		},
		...lightColors
	}
});

export const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#026DD1'
		},
		...darkColors
	}
});

export function getThemeColor(
	theme: Theme,
	colorName: keyof Colors
): string | undefined {
	return theme.palette.mode === 'light'
		? lightColors[colorName]
		: darkColors[colorName];
}

export function getPriorityColor(priorityId: number): string {
	return priorityColors[priorityId];
}
