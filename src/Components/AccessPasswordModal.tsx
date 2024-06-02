import {Modal, Paper, Typography, TextField, Button, Box} from '@mui/material';
import React from 'react';

interface AccessPasswordModalProps {
	readonly setHidePassModalOpened: () => void;
	readonly setRevealPassModalOpened: () => void;
	readonly hidePassModalOpened: boolean;
	readonly revealPassModalOpened: boolean;
}

export const AccessPasswordModal = (
	props: AccessPasswordModalProps
): React.ReactElement => {
	const [hideItemPass, setHideItemPass] = React.useState<string>('');
	const [revealItemPass, setRevealItemPass] = React.useState<string>('');

	if (props.revealPassModalOpened) {
		return (
			<Modal
				open={props.revealPassModalOpened}
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
						justifyContent: 'center',
						padding: '30px 0',
						width: {
							xs: '100%',
							md: '40%'
						},
						height: {
							xs: '25%',
							md: 'auto'
						}
					}}
				>
					<Typography>
						Type password of wish you want to reveal
					</Typography>
					<TextField
						onChange={(e) => {
							setRevealItemPass(e.currentTarget.value);
							console.log(revealItemPass);
						}}
						placeholder='Type password'
						sx={{
							width: {
								xs: '55%',
								md: '70%'
							},
							margin: '10px 0'
						}}
					></TextField>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							width: '80%'
						}}
					>
						<Button
							onClick={() => {
								props.setRevealPassModalOpened();
								setRevealItemPass('');
							}}
							variant='contained'
							sx={{
								margin: '10px'
							}}
						>
							Cancel
						</Button>
						<Button
							variant='contained'
							sx={{
								margin: '10px'
							}}
						>
							Confirm
						</Button>
					</Box>
				</Paper>
			</Modal>
		);
	}
	return (
		<Modal
			open={props.hidePassModalOpened}
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
					justifyContent: 'center',
					padding: '30px 0',
					width: {
						xs: '100%',
						md: '35%'
					},
					height: {
						xs: '25%',
						md: 'auto'
					}
				}}
			>
				<Typography>Set password for this wish</Typography>
				<TextField
					onChange={(e) => {
						setHideItemPass(e.currentTarget.value);
						console.log(hideItemPass);
					}}
					placeholder='Type password'
					sx={{
						width: {
							xs: '55%',
							md: '70%'
						},
						margin: '10px 0'
					}}
				></TextField>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						width: '80%'
					}}
				>
					<Button
						onClick={() => {
							props.setHidePassModalOpened();
							setHideItemPass('');
						}}
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						Cancel
					</Button>
					<Button
						variant='contained'
						sx={{
							margin: '10px'
						}}
					>
						Confirm
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
};
