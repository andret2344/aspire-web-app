import { getPriorityColor } from '../theme';

export interface Priority {
	readonly value: number;
	readonly color: string;
	readonly description: string;
}

const PRIORITY_HIGH: Priority = {
	value: 1,
	color: getPriorityColor(1),
	description: 'Bardzo tego potrzebuję, pilny, niemalże krytyczna potrzeba.'
};

const PRIORITY_MEDIUM: Priority = {
	value: 2,
	color: getPriorityColor(2),
	description: 'Przydałoby mi się, gdyż często odczuwam brak.'
};

const PRIORITY_LOW: Priority = {
	value: 3,
	color: getPriorityColor(3),
	description: 'Jak już naprawdę nie ma innej możliwości, niech będzie.'
};

export function getAllPriorities(): Priority[] {
	return [PRIORITY_HIGH, PRIORITY_MEDIUM, PRIORITY_LOW];
}

export function getPriority(priorityId: number): Priority | undefined {
	return getAllPriorities().find(
		(p: Priority): boolean => p.value === priorityId
	);
}
