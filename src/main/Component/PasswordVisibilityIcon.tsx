import React from 'react';
import {Visibility, VisibilityOff} from '@mui/icons-material';

interface RenderPasswordVisibilityIconProps {
	readonly visible?: boolean;
}

export function PasswordVisibilityIcon(props: RenderPasswordVisibilityIconProps): React.ReactElement {
	if (props.visible) {
		return (
			<Visibility
				sx={{
					margin: 0,
					padding: 0
				}}
				data-testid='password-icon-visible'
			/>
		);
	}
	return (
		<VisibilityOff
			sx={{
				margin: 0,
				padding: 0
			}}
			data-testid='password-icon-invisible'
		/>
	);
}
