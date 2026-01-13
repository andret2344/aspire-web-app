import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigateFunction, useNavigate, useParams} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import {Typography} from '@mui/material';
import {mapWishlistFromDto, WishList} from '@entity/WishList';
import {getWishlist} from '@service/WishListService';

export function WishlistSettingsPage(): React.ReactElement {
	type Params = {readonly id?: string};

	const [wishlist, setWishlist] = React.useState<WishList | undefined>(undefined);
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const params: Params = useParams<Params>();
	const navigate: NavigateFunction = useNavigate();
	const {t} = useTranslation();
	const {enqueueSnackbar} = useSnackbar();

	const wishlistId: number = +(params?.id ?? -1);

	React.useEffect((): void => {
		getWishlist(wishlistId)
			.then(mapWishlistFromDto)
			.then(setWishlist)
			.catch((): void => {
				enqueueSnackbar(t('something-went-wrong'), {variant: 'error'});
				navigate('/error');
			})
			.finally((): void => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <></>;
	}

	return <Typography>{wishlist?.name}&#39;s settings</Typography>;
}
