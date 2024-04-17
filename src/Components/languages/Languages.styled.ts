import MenuItem, {MenuItemProps} from '@mui/material/MenuItem';
import {IconButton} from '@mui/material';
import styled, {css} from 'styled-components';

interface StyledMenuItemProps extends MenuItemProps {
	$active: boolean;
}
export const StyledButton = styled(IconButton)`
	width: 1.5rem;
	height: 1.5rem;
	padding: 0;
	border: none;
	background: none;
`;

export const StyledMenuItem = styled(MenuItem)<StyledMenuItemProps>`
	${({$active}) =>
		$active &&
		css`
			&& {
				border-right: 3px solid blue;
			}
		`}
`;
