import React from 'react';
import {screen} from '@testing-library/dom';
import '@testing-library/jest-dom';
import {PriorityBadge} from '../../main/Component/PriorityBadge';
import {renderForTest} from '../__utils__/RenderForTest';
import {RenderResult} from '@testing-library/react';

describe('PriorityBadge', (): void => {
	test('renders with correct id', (): void => {
		// arrange
		renderForTest(<PriorityBadge value={1} />);

		// act
		const priorityNumber: HTMLElement =
			screen.getByTestId('item-priority-chip');

		// assert
		expect(priorityNumber).toBeInTheDocument();
	});

	test('renders with incorrect id', (): void => {
		// arrange
		const render: RenderResult = renderForTest(
			<PriorityBadge value={-1} />
		);

		// assert
		expect(render.container).toBeEmptyDOMElement();
	});
});
