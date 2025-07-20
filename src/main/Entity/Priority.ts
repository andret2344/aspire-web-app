import {getPriorityColor} from '../Utils/theme';

export interface Priority {
	readonly value: number;
	readonly color: string;
	readonly descriptionKey: string;
}

const PRIORITY_HIGH: Priority = {
	value: 1,
	color: getPriorityColor(1),
	descriptionKey: 'priority-description-high'
};

const PRIORITY_MEDIUM: Priority = {
	value: 2,
	color: getPriorityColor(2),
	descriptionKey: 'priority-description-medium'
};

const PRIORITY_LOW: Priority = {
	value: 3,
	color: getPriorityColor(3),
	descriptionKey: 'priority-description-low'
};

export function getAllPriorities(): Priority[] {
	return [PRIORITY_HIGH, PRIORITY_MEDIUM, PRIORITY_LOW];
}

export function getPriority(priorityId: number): Priority | undefined {
	return getAllPriorities().find(
		(p: Priority): boolean => p.value === priorityId
	);
}
