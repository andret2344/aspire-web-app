import {Modal, Paper, Typography, TextField} from '@mui/material';
import React from 'react';

interface AccessPasswordModalProps {
	readonly opened: boolean;
}

export const AccessPasswordModal = (
	props: AccessPasswordModalProps
): React.ReactElement => {
	return (
		<Modal
			open={props.opened}
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
				<Typography>Set Password</Typography>
				<TextField
					placeholder='Start typing Password on keyboard'
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
