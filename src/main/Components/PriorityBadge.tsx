import {Tooltip, Typography} from '@mui/material';
import React from 'react';
import {getPriority, Priority} from '../Entity/Priority';

interface PriorityBadgeProps {
	readonly priorityId: number;
}

export function PriorityBadge(props: PriorityBadgeProps): React.ReactElement {
	const priority: Priority | undefined = getPriority(props.priorityId);

	if (!priority) {
		return <></>;
	}

	return (
		<Tooltip
			title={priority.description}
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Typography
				data-testid='priority-number'
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
					justifySelf: 'center'
				}}
			>
				{priority.value}
			</Typography>
		</Tooltip>
	);
}
