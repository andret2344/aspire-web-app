import React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {IconButton} from '@mui/material';

interface ToggleColorModeComponentProps {
	readonly darkMode: boolean;
	readonly toggleDarkMode: () => void;
}

export function ToggleColorModeComponent(props: ToggleColorModeComponentProps): React.ReactElement {
	function renderIcon(): React.ReactElement {
		if (props.darkMode) {
			return <LightModeIcon data-testid='icon-light' />;
		}
		return <DarkModeIcon data-testid='icon-dark' />;
	}

	return (
		<IconButton
			data-testid='icon-button'
			color='warning'
			onClick={props.toggleDarkMode}
		>
			{renderIcon()}
		</IconButton>
	);
}
