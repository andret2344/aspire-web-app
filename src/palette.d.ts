import { Palette, PaletteOptions } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		otherColor: {
			mainBlue?: string;
			raspberryPink?: string;
		};
	}

	interface PaletteOptions {
		otherColor: {
			mainBlue?: string;
			raspberryPink?: string;
		};
	}
}

export default function createPalette(palette: PaletteOptions): Palette;
