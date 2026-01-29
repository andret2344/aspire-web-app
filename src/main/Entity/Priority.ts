import {getPriorityColor} from '@util/theme';

export interface Priority {
	readonly label: string;
	readonly value: number;
	readonly color: string;
	readonly descriptionKey: string;
}

const PRIORITY_UNKNOWN: Priority = {
	label: '?',
	value: 0,
	color: getPriorityColor(0),
	descriptionKey: 'priority-description-unknown'
};

const PRIORITY_HIGH: Priority = {
	label: '1',
	value: 1,
	color: getPriorityColor(1),
	descriptionKey: 'priority-description-high'
};

const PRIORITY_MEDIUM: Priority = {
	label: '2',
	value: 2,
	color: getPriorityColor(2),
	descriptionKey: 'priority-description-medium'
};

const PRIORITY_LOW: Priority = {
	label: '3',
	value: 3,
	color: getPriorityColor(3),
	descriptionKey: 'priority-description-low'
};

export function getAllPriorities(): Priority[] {
	return [PRIORITY_UNKNOWN, PRIORITY_HIGH, PRIORITY_MEDIUM, PRIORITY_LOW];
}

export function getPriority(priorityId: number): Priority | undefined {
	return getAllPriorities().find((p: Priority): boolean => p.value === priorityId);
}
