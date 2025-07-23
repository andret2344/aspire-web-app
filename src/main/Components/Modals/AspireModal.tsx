import React from 'react';
import {Box, Modal, Paper, Typography} from '@mui/material';

interface AspireModalProps {
	readonly 'data-testid'?: string;
	readonly title: React.ReactElement | string;
	readonly open: boolean;
	readonly onClose: () => void;
	readonly onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	readonly width?: string;
	readonly maxWidth?: string;
}

export function AspireModal(
	props: React.PropsWithChildren<AspireModalProps>
): React.ReactElement {
	return (
		<Modal
			data-testid={props['data-testid']}
			onClose={props.onClose}
			open={props.open}
			aria-labelledby='modal-title'
			aria-describedby='modal-description'
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				margin: {
					xs: '0',
					md: '30px 0'
				},
				overflow: 'scroll'
			}}
		>
			<Paper
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '26px 26px',
					width: props.width ?? 'auto',
					maxWidth: {
						xs: '100%',
						md: props.maxWidth ?? 'auto'
					}
				}}
				component='form'
				onSubmit={props.onSubmit}
			>
				<Typography
					id='modal-title'
					variant='h5'
					component='div'
					sx={{padding: '10px 0'}}
				>
					{props.title}
				</Typography>
				{props.children}
			</Paper>
		</Modal>
	);
}
