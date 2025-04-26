import React from 'react';
import {Modal, Paper, Typography} from '@mui/material';

interface AspireModalProps {
	readonly title: React.ReactElement | string;
	readonly opened: boolean;
	readonly onClose: () => void;
	readonly onSubmit?: () => void;
	readonly width?: string;
}

export function AspireModal(
	props: React.PropsWithChildren<AspireModalProps>
): React.ReactElement {
	return (
		<Modal
			onClose={props.onClose}
			open={props.opened}
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: {
					xs: '0',
					md: '30px 0'
				}
			}}
		>
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '36px 48px',
					width: props.width ?? 'auto',
					height: {
						xs: '100%',
						md: 'auto'
					}
				}}
				component='form'
				onSubmit={props.onSubmit}
			>
				<Typography
					id='modal-title'
					variant='h5'
					component='div'
				>
					{props.title}
				</Typography>
				{props.children}
			</Paper>
		</Modal>
	);
}
