import {
	Modal,
	Paper,
	Typography,
	TextField,
	Button,
	Box,
	InputAdornment,
	IconButton
} from '@mui/material';
import {RenderPasswordVisibilityIcon} from './PasswordVisibilityIcon';
import {setWishlistPassword} from '../Services/WishListService';
import React from 'react';
import {WishList} from '../Entity/WishList';

interface AccessPasswordModalProps {
	readonly wishlist: WishList;
	readonly setHidePassModalOpened: () => void;
	readonly setRevealPassModalOpened: () => void;
	readonly getWishlistHiddenItems: (id: number) => void;
	readonly hidePassModalOpened: boolean;
	readonly revealPassModalOpened: boolean;
}

export const AccessPasswordModal = (
	props: AccessPasswordModalProps
): React.ReactElement => {
	const [hideItemPass, setHideItemPass] = React.useState<string>('');
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	const handleClickShowPassword = (): void => {
		setShowPassword((prev: boolean): boolean => !prev);
	};

	if (props.revealPassModalOpened && props.wishlist.id) {
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
					<Typography>Enter password for this wishlist</Typography>
					<TextField
						type={showPassword ? 'text' : 'password'}
						autoComplete={'new-password'}
						InputProps={{
							endAdornment: (
								<InputAdornment
									position='end'
									sx={{margin: 0, padding: 0}}
								>
									<IconButton
										data-testid={'visibilityIcon'}
										sx={{margin: 0, padding: 0}}
										onClick={handleClickShowPassword}
									>
										<RenderPasswordVisibilityIcon
											showPassword={showPassword}
										/>
									</IconButton>
								</InputAdornment>
							)
						}}
						hiddenLabel
						variant={'filled'}
						placeholder={'Password'}
						onChange={(e) => {
							setHideItemPass(e.currentTarget.value);
						}}
						sx={{
							width: {
								xs: '55%',
								md: '70%'
							},
							margin: '10px 0'
						}}
						required
					/>

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
							onClick={() => {
								setWishlistPassword(
									props.wishlist.id,
									hideItemPass
								);
								props.setRevealPassModalOpened();
								setHideItemPass('');
							}}
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
				<Typography>
					Enter password to reveal hidden wishlists
				</Typography>
				<TextField
					type={showPassword ? 'text' : 'password'}
					autoComplete={'new-password'}
					InputProps={{
						endAdornment: (
							<InputAdornment
								position='end'
								sx={{margin: 0, padding: 0}}
							>
								<IconButton
									data-testid={'visibilityIcon'}
									sx={{margin: 0, padding: 0}}
									onClick={handleClickShowPassword}
								>
									<RenderPasswordVisibilityIcon
										showPassword={showPassword}
									/>
								</IconButton>
							</InputAdornment>
						)
					}}
					hiddenLabel
					variant={'filled'}
					placeholder={'Password'}
					onChange={(e) => {
						setHideItemPass(e.currentTarget.value);
						console.log(hideItemPass);
					}}
					sx={{
						width: {
							xs: '55%',
							md: '70%'
						},
						margin: '10px 0'
					}}
					required
				/>

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
						onClick={() =>
							props.getWishlistHiddenItems(props.wishlist.id)
						}
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
