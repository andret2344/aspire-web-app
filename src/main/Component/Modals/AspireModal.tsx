import React from 'react';
import {Backdrop, Modal, Paper, Typography} from '@mui/material';
import {getThemeColor} from '@util/theme';
import {Theme} from '@mui/material';
import {SystemStyleObject} from '@mui/system';

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
				}
			}}
		>
			<Paper
				sx={(theme: Theme): SystemStyleObject<Theme> => ({
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '26px 46px',
					borderRadius: '0.75rem',
					backgroundColor: getThemeColor(theme, 'bgModal'),
					boxShadow: '8px 8px 24px 0px rgba(0, 0, 0, 1)',
					width: props.width ?? 'auto',
					maxWidth: {
						xs: '100%',
						md: props.maxWidth ?? 'auto'
					}
				})}
				component='form'
				onSubmit={props.onSubmit}
			>
				<Typography
					id='modal-title'
					component='div'
					variant='h6'
					sx={{padding: '10px 0'}}
				>
					{props.title}
				</Typography>
				{props.children}
			</Paper>
		</Modal>
	);
}
