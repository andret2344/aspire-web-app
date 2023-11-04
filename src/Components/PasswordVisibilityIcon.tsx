import React from 'react';
import {Visibility, VisibilityOff} from '@mui/icons-material';

interface RenderPasswordVisibilityIconProps {
	readonly showPassword: boolean;
}

export const RenderPasswordVisibilityIcon = (
	props: RenderPasswordVisibilityIconProps
): React.ReactElement => {
	if (props.showPassword) {
		return <Visibility sx={{margin: 0, padding: 0}} />;
	}
	return <VisibilityOff sx={{margin: 0, padding: 0}} />;
};
