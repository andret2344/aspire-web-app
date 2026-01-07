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
	redError: string;
	bgAccent1: string;
	bgModal: string;
}

const lightColors: Colors = {
	blue: 'rgba(0, 109, 209, 0.17)',
	red: '#670303',
	redError: '#ff3d3d',
	lightBlue: '#D9E6F7',
	activeBlue: 'rgba(0, 109, 209, 0.4)',
	bgAccent1: 'rgba(225, 225, 225, 1)',
	bgModal: 'rgba(225, 225, 225, 1)'
};

const darkColors: Colors = {
	blue: '#026DD1',
	red: '#e08888',
	redError: '#aa0000',
	lightBlue: 'rgba(0, 109, 209, 0.4)',
	activeBlue: 'rgba(0, 109, 209, 0.4)',
	bgAccent1: 'rgba(30, 30, 30, 1)',
	bgModal: 'rgba(1, 9, 27, 1)'
};

export const lightTheme: Theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#026DD1'
		},
		...lightColors
	}
});

export const darkTheme: Theme = createTheme({
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
	colorName: keyof Colors,
	defaultColor: string = '#000000'
): string {
	switch (theme.palette.mode) {
		case 'light':
			return lightColors[colorName] ?? defaultColor;
		case 'dark':
			return darkColors[colorName] ?? defaultColor;
		default:
			return defaultColor;
	}
}

export function getPriorityColor(priority: number): string {
	return priorityColors[priority];
}
