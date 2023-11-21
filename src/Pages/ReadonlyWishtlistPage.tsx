import React from 'react';
import {Header} from '../Components/Header';
import Grid from '@mui/material/Unstable_Grid2';
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {WishlistItem} from '../Entity/WishlistItem';
import Row from '../Components/Row';
import {WishlistSidebarItem} from '../Components/WishlistSidebarItem';
import {getReadonlyWishlistByUUID} from '../Services/WishListService';
import {useNavigate, useParams} from 'react-router-dom';

export const ReadonlyWishtlistPage: React.FC = (): React.ReactElement => {
	type Params = {uuid?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const [wishlist, setWishlist] = React.useState<WishList | null>(null);

	React.useEffect((): void => {
		if (params.uuid) {
			fetchSelectedWishlist(params.uuid)
				.then((wishlist): void => {
					if (wishlist) {
						setWishlist(wishlist);
					} else {
						navigate('/error');
					}
				})
				.catch((): void => {
					navigate('/error');
				});
		} else {
			setWishlist(null);
		}
	}, [params.uuid]);

	const fetchSelectedWishlist = async (
		uuid: string
	): Promise<WishList | null> => {
		return await getReadonlyWishlistByUUID(uuid);
	};

	const renderWishlistItem = (
		wishlistItem: WishlistItem
	): React.ReactElement => (
		<Row
			key={wishlistItem?.id}
			row={wishlistItem}
			wishlistId={wishlist?.id}
		/>
	);

	const renderWishlistSidebarItem = (): React.ReactElement => {
		if (wishlist) {
			return (
				<WishlistSidebarItem
					key={wishlist.id}
					wishlist={wishlist}
					readonly={true}
				/>
			);
		}
		return <></>;
	};

	return (
		<Header>
			<Grid
				sx={{flexGrow: 1}}
				disableEqualOverflow={true}
				container
				columnSpacing={2}
			>
				<Grid
					sx={(
						theme
					): {
						paddingBottom: '15px';
						alignItems: 'center';
						flexDirection: 'column';
						borderRight: string;
						display: 'flex';
						justifyContent: 'flex-start';
					} => ({
						paddingBottom: '15px',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						borderRight: `2px solid ${theme.palette.divider}`
					})}
					xs={12}
					md={3}
				>
					{renderWishlistSidebarItem()}
				</Grid>
				{wishlist && (
					<Grid
						xs={12}
						md={9}
					>
						<Box
							sx={(
								theme
							): {
								backgroundColor: string | undefined;
								alignItems: 'center';
								display: 'flex';
								width: '100%';
								borderTop: '2px #FFFFFF';
								paddingLeft: '10px';
								justifyContent: 'space-between';
								height: '60px';
							} => ({
								height: '60px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%',
								backgroundColor:
									theme.palette.mode === 'dark'
										? ''
										: getThemeColor(theme, 'lightBlue'),
								borderTop: '2px #FFFFFF',
								paddingLeft: '10px'
							})}
						>
							{wishlist?.name}
						</Box>
						<TableContainer
							sx={{
								maxHeight: '75vh',
								overflowY: 'auto'
							}}
							component={Paper}
						>
							<Table aria-label='collapsible table'>
								<TableHead>
									<TableRow>
										<TableCell
											width={'5%'}
											align='left'
										/>
										<TableCell align='left'>Id</TableCell>
										<TableCell align='left'>Name</TableCell>
										<TableCell
											width={'10%'}
											align='center'
										>
											Priority
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{wishlist?.wishlistItems?.map(
										renderWishlistItem
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				)}
			</Grid>
		</Header>
	);
};
