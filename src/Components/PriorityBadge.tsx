import {Box, Tooltip, Typography} from '@mui/material';
import React from 'react';
import {getPriority} from '../Entity/Priority';

interface PriorityBadgeProps {
	readonly priorityId: number;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = (
	props: PriorityBadgeProps
): React.ReactElement | null => {
	const priority = getPriority(props.priorityId);

	if (!priority) {
		return null;
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
						data-testid={'priority-number'}
						color={'black'}
					>
						{priority.value}
					</Typography>
				</Box>
			</div>
		</Tooltip>
	);
};
