import React, {useState} from 'react';
import {ReactCountryFlag} from 'react-country-flag';
import {useTranslation} from 'react-i18next';
import Menu from '@mui/material/Menu';
import {getLanguages, Language} from '../Entity/Language';
import {Button, MenuItem} from '@mui/material';

export function LanguagePicker(): React.ReactElement {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const {i18n} = useTranslation();
	const currentLanguage = i18n.language;

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

	function renderLanguageName(language: Language): React.ReactElement | null {
		if (language.code === currentLanguage)
			return (
				<Button
					onClick={handleClick}
					sx={{fontFamily: 'Montserrat', marginLeft: '5px'}}
					variant='contained'
				>
					{language.name}
				</Button>
			);
		return null;
	}

	return (
		<div className='LanguagePicker'>
			{getLanguages().map(renderLanguageName)}
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
