import {Tooltip, Typography} from '@mui/material';
import React from 'react';
import {getPriority, Priority} from '@entity/Priority';
import {useTranslation} from 'react-i18next';

interface PriorityBadgeProps {
	readonly value: number;
	readonly onClick?: React.MouseEventHandler<HTMLDivElement>;
	readonly 'data-testid'?: string;
}

export function PriorityBadge(props: PriorityBadgeProps): React.ReactElement {
	const priority: Priority | undefined = getPriority(props.value);
	const {t} = useTranslation();

	if (!priority) {
		return <></>;
	}

	return (
		<Tooltip
			title={t(priority.descriptionKey)}
			arrow
			disableInteractive
			onClick={props.onClick}
		>
			<Typography
				data-testid={props['data-testid'] ?? 'item-priority-chip'}
				color='black'
				sx={{
					backgroundColor: priority.color,
					borderRadius: '50%',
					width: {
						xs: '24px',
						md: '30px'
					},
					height: {
						xs: '24px',
						md: '30px'
					},
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{priority.value}
			</Typography>
		</Tooltip>
	);
}
