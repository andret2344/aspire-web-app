import {Box, Container, Link, Typography} from '@mui/material';
import React from 'react';
import {Link as Anchor} from 'react-router-dom';

export function Header(): React.ReactElement {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				position: 'fixed',
				width: '100%',
				padding: '0px',
				zIndex: 1000
			}}
		>
			<Container
				aria-label='header-container'
				maxWidth={false}
				sx={{
					backgroundColor: 'primary.main',
					display: 'flex'
				}}
			>
				<Box
					sx={{
						minWidth: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Box>
						<Typography
							variant='h6'
							noWrap
						>
							<Link
								component={Anchor}
								to='/'
								sx={{
									fontFamily: 'Courgette',
									fontWeight: 700,
									fontSize: '35px',
									letterSpacing: '.3rem',
									color: 'white',
									textDecoration: 'none'
								}}
							>
								Aspire
							</Link>
						</Typography>
					</Box>
				</Box>
			</Container>
		</Box>
	);
}
