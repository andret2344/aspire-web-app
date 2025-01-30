import React from 'react';
import {
	Box,
	Grid2,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme
} from '@mui/material';
import {getThemeColor} from '../Styles/theme';
import {WishList} from '../Entity/WishList';
import {WishlistItem} from '../Entity/WishlistItem';
import {WishlistItemComponent} from '../Components/WishlistItemComponent';
import {getReadonlyWishlistByUUID} from '../Services/WishListService';
import {useNavigate, useParams} from 'react-router-dom';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {useTranslation} from 'react-i18next';

export function ReadonlyWishlistPage(): React.ReactElement {
	type Params = {uuid?: string};
	const params: Params = useParams<Params>();
	const navigate = useNavigate();
	const [wishlist, setWishlist] = React.useState<WishList | null>(null);
	const {t} = useTranslation();

	React.useEffect((): void => {
		if (params.uuid) {
			fetchSelectedWishlist(params.uuid)
				.then((wishlist: WishList | null): void => {
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
	}, [navigate, params.uuid]);

	async function fetchSelectedWishlist(
		uuid: string
	): Promise<WishList | null> {
		return await getReadonlyWishlistByUUID(uuid);
	}

	function renderWishlistItem(
		wishlistItem: WishlistItem,
		index: number,
		currentWishlist: WishList
	): React.ReactElement {
		return (
			<WishlistItemComponent
				key={wishlistItem.id}
				row={wishlistItem}
				position={index + 1}
				wishlistId={currentWishlist.id}
				onEdit={jest.fn()}
				onRemove={jest.fn()}
			/>
		);
	}

	function renderItems(): React.ReactNode[] | undefined {
		return wishlist?.wishlistItems.map(
			(item: WishlistItem, index: number): React.ReactNode =>
				renderWishlistItem(item, index, wishlist)
		);
	}

	return (
		<Grid2
			flexGrow={{sx: 1}}
			container
			columnSpacing={2}
		>
			{wishlist && (
				<Grid2 size={{xs: 12}}>
					<Box
						sx={(theme: Theme): SystemStyleObject<Theme> => ({
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
						{wishlist.name}
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
										width='5%'
										align='left'
									/>
									<TableCell align='left'>
										{t('item-no')}
									</TableCell>
									<TableCell align='left'>
										{t('name')}
									</TableCell>
									<TableCell
										width='10%'
										align='center'
									>
										{t('priority')}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>{renderItems()}</TableBody>
						</Table>
					</TableContainer>
				</Grid2>
			)}
		</Grid2>
	);
}
