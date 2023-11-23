import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import {IconButton} from '@mui/material';
import React from 'react';

interface ToggleColorModeComponentProps {
	readonly darkMode: boolean;
	readonly toggleDarkMode: () => void;
}

export const ToggleColorModeComponent = (
	props: ToggleColorModeComponentProps
): React.ReactElement => {
	const renderIcon = (): React.ReactElement => {
		if (props.darkMode) {
			return <LightModeIcon />;
		}
		return <DarkModeIcon />;
	};

	return (
		<IconButton
			color={'warning'}
			onClick={props.toggleDarkMode}
		>
			{renderIcon()}
		</IconButton>
	);
};
