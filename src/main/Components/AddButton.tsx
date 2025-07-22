import React from 'react';
import {Button} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export interface AddButtonProps {
	readonly onClick?: () => void;
}

export function AddButton(
	props: React.PropsWithChildren<AddButtonProps>
): React.ReactElement {
	return (
		<Button
			data-testid='open-modal-button'
			onClick={props.onClick}
			variant='outlined'
			sx={{
				fontSize: '0.75rem',
				letterSpacing: '0.2rem',
				padding: '1rem'
			}}
			startIcon={<AddCircleOutlineIcon />}
		>
			{props.children}
		</Button>
	);
}
