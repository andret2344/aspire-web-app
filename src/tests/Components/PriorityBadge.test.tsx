import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {PriorityBadge} from '../../Components/PriorityBadge';
import {renderForTest} from '../Utils/RenderForTest';

describe('PriorityBadge', (): void => {
	test('renders with correct id', (): void => {
		// arrange
		renderForTest(<PriorityBadge priorityId={1} />);

		// act
		const priorityNumber = screen.getByTestId('priority-number');

		// assert
		expect(priorityNumber).toBeInTheDocument();
	});

	test('renders with incorrect id', (): void => {
		// arrange
		const render = renderForTest(<PriorityBadge priorityId={-1} />);

		// assert
		expect(render.container).toBeEmptyDOMElement();
	});
});
