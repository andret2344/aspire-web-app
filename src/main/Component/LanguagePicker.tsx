import React, {useState} from 'react';
import {ReactCountryFlag} from 'react-country-flag';
import {useTranslation} from 'react-i18next';
import {Button, MenuItem} from '@mui/material';
import Menu from '@mui/material/Menu';
import {getLanguageByCode, getLanguages, Language} from '@entity/Language';

export function LanguagePicker(): React.ReactElement {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const {i18n} = useTranslation();
	const currentLanguage: string = i18n.language;

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
					borderRight: language.code === i18n.language ? '3px solid blue' : 'unset'
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

	function renderLanguageName(code: string): React.ReactElement | null {
		const language = getLanguageByCode(code);
		return (
			<Button
				onClick={handleClick}
				sx={{
					fontFamily: 'Montserrat',
					marginLeft: '5px'
				}}
				variant='contained'
			>
				{language?.name}
			</Button>
		);
	}

	return (
		<div className='LanguagePicker'>
			{renderLanguageName(currentLanguage)}
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
