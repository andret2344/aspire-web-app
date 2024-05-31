import {Modal, Paper, Typography, TextField} from '@mui/material';
import React from 'react';

interface AccessPasswordModalProps {
	readonly setNewPassOpened: boolean;
	readonly typePassOpened: boolean;
}

export const AccessPasswordModal = (
	props: AccessPasswordModalProps
): React.ReactElement => {
	if (props.typePassOpened) {
		return (
			<Modal
				open={props.typePassOpened}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
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
						padding: '30px 0',
						width: {
							xs: '100%',
							md: '40%'
						},
						height: {
							xs: '100%',
							md: 'auto'
						}
					}}
				>
					<Typography>
						Type password of wish you want to reveal
					</Typography>
					<TextField
						placeholder='Type password'
						sx={{
							width: {
								xs: '95%',
								md: '80%'
							},
							marginTop: '15px'
						}}
					></TextField>
				</Paper>
			</Modal>
		);
	}
	return (
		<Modal
			open={props.setNewPassOpened}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
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
					padding: '30px 0',
					width: {
						xs: '100%',
						md: '40%'
					},
					height: {
						xs: '100%',
						md: 'auto'
					}
				}}
			>
				<Typography>Set password for this wish</Typography>
				<TextField
					placeholder='Type password'
					sx={{
						width: {
							xs: '95%',
							md: '80%'
						},
						marginTop: '15px'
					}}
				></TextField>
			</Paper>
		</Modal>
	);
};
