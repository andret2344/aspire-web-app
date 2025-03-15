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
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {SystemStyleObject} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {useTranslation} from 'react-i18next';

export function ReadonlyWishlistPage(): React.ReactElement {
	type Params = {readonly uuid: string};
	const params: Params = useParams<Params>() as Params;
	const navigate: NavigateFunction = useNavigate();
	const [wishlist, setWishlist] = React.useState<WishList | undefined>(
		undefined
	);
	const {t} = useTranslation();

	React.useEffect((): void => {
		getReadonlyWishlistByUUID(params.uuid)
			.then(setWishlist)
			.catch((): void => {
				navigate('/error');
			});
	}, [navigate, params.uuid]);

	function renderWishlistItem(
		wishlistItem: WishlistItem,
		index: number
	): React.ReactElement {
		return (
			<WishlistItemComponent
				key={wishlistItem.id}
				item={wishlistItem}
				position={index + 1}
				wishlistId={wishlist!.id}
				onEdit={jest.fn()}
				onRemove={jest.fn()}
			/>
		);
	}

	function renderItems(): React.ReactNode[] {
		return wishlist!.wishlistItems.map(renderWishlistItem);
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
							backgroundColor: getThemeColor(theme, 'lightBlue'),
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
