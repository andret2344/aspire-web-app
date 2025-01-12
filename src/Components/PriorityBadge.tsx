import {Box, Tooltip, Typography} from '@mui/material';
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
		<Tooltip title={priority.description}>
			<div>
				<Box
					sx={{
						backgroundColor: priority.color,
						borderRadius: '50%',
						width: {
							xs: '30px',
							md: '40px'
						},
						height: {
							xs: '30px',
							md: '40px'
						},
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					title={priority.description}
				>
					<Typography
						data-testid='priority-number'
						color='black'
					>
						{priority.value}
					</Typography>
				</Box>
			</div>
		</Tooltip>
	);
}
