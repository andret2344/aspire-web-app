import {createTheme, Theme, ThemeOptions} from '@mui/material';

const PRIORITY_COLOR_HIGH = 'rgba(255, 99, 71, 1)';
const PRIORITY_COLOR_MEDIUM = 'rgba(255, 255, 0, 1)';
const PRIORITY_COLOR_LOW = 'rgba(0, 255, 0, 1)';

const priorityColors: {
	[key: number]: string;
} = {
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

const defaultThemeOptions: ThemeOptions = {
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				'.mdxeditor-popup-container': {
					zIndex: 1500,
				},
				'.mdxeditor-select-content': {
					zIndex: 1500,
				},

				'.md-render table': {
					width: '100%',
					borderCollapse: 'collapse',
					marginTop: '12px',
					marginBottom: '12px',
					display: 'block',
					overflowX: 'auto',
				},
				'.md-render th, .md-render td': {
					border: '1px solid',
					borderColor: 'black',
					padding: '8px 12px',
					verticalAlign: 'top',
					whiteSpace: 'nowrap',
				},
				'.md-render thead th': {
					fontWeight: 600,
				},
			},
		},
	},
}

export const lightTheme: Theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#026DD1'
		},
		...lightColors
	},
	...defaultThemeOptions
});

export const darkTheme: Theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#026DD1'
		},
		...darkColors
	},
	...defaultThemeOptions
});

export function getThemeColor(theme: Theme, colorName: keyof Colors, defaultColor: string = '#000000'): string {
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
