import React, {useState} from 'react';
import {ReactCountryFlag} from 'react-country-flag';
import {useTranslation} from 'react-i18next';
import Menu from '@mui/material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import {getLanguages, Language} from '../Entity/Language';
import {IconButton, MenuItem} from '@mui/material';

export function LanguagePicker(): React.ReactElement {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const {i18n} = useTranslation();

	function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		setAnchorEl(event.currentTarget);
	}

	function handleClose(): void {
		setAnchorEl(null);
	}

	function renderLanguage(language: Language): React.ReactElement {
		return (
			<MenuItem
				key={language.iconCode}
				style={{
					borderRight:
						language.code === i18n.language
							? '3px solid blue'
							: 'unset'
				}}
				onClick={(): void => {
					i18n.changeLanguage(language.code);
					handleClose();
				}}
			>
				<ReactCountryFlag
					svg
					countryCode={language.iconCode}
				/>
				{language.name}
			</MenuItem>
		);
	}

	return (
		<div className='LanguagePicker'>
			<IconButton onClick={handleClick}>
				<TranslateIcon
					color='inherit'
					fontSize={'large'}
				/>
			</IconButton>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
			>
				{getLanguages().map(renderLanguage)}
			</Menu>
		</div>
	);
}
