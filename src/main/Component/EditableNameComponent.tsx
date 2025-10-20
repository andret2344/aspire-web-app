import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {Box, IconButton, Input, Typography} from '@mui/material';

interface EditableNameComponentProps {
	readonly name: string;
	readonly editable: boolean;
	readonly onChange: (name: string) => Promise<string>;
}

export function EditableNameComponent(
	props: EditableNameComponentProps
): React.ReactElement {
	const [editedName, setEditedName] = React.useState<string | undefined>(
		undefined
	);
	const [displayName, setDisplayName] = React.useState<string>(props.name);

	function handleNameClick(event: React.MouseEvent): void {
		event.stopPropagation();
		setEditedName(props.name);
	}

	function handleNameChange(
		event: React.ChangeEvent<HTMLInputElement>
	): void {
		setEditedName(event.target.value);
	}

	function handleNameSubmit(): void {
		setEditedName(undefined);
		setDisplayName(editedName ?? props.name);
		if (!editedName || editedName === props.name) {
			return;
		}
		props
			.onChange(editedName)
			.catch((): void => setDisplayName(props.name));
	}

	function renderTypographyName(): React.ReactElement {
		return (
			<Typography>
				<IconButton
					size='small'
					onClick={handleNameClick}
					data-testid='editable-name-button-edit'
				>
					<EditIcon />
				</IconButton>
				{displayName}
			</Typography>
		);
	}

	function renderInputName(): React.ReactElement {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center'
				}}
			>
				<IconButton
					size='small'
					data-testid='editable-name-button-done'
				>
					<DoneIcon />
				</IconButton>
				<Input
					data-testid='editable-name-input-name'
					defaultValue={editedName}
					onClick={handleNameClick}
					onChange={handleNameChange}
					onBlur={handleNameSubmit}
					autoFocus
					fullWidth
					sx={{
						maxWidth: '75%'
					}}
				/>
			</Box>
		);
	}

	if (editedName !== undefined) {
		return renderInputName();
	}
	if (!props.editable) {
		return <>{props.name}</>;
	}
	return renderTypographyName();
}
