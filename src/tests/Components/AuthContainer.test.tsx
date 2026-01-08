import {renderForTest} from '../__utils__/RenderForTest';
import {screen} from '@testing-library/dom';
import {AuthContainer} from '@component/AuthContainer';

describe('AuthContainer', (): void => {
	test('renders correctly', (): void => {
		// act
		renderForTest(
			<AuthContainer>
				<div data-testid='test-div'>Hello</div>
			</AuthContainer>
		);

		// assert
		expect(screen.getByText('Aspire')).toBeInTheDocument();
		expect(screen.getByText('subtitle')).toBeInTheDocument();
		expect(screen.getByTestId('test-div')).toHaveTextContent('Hello');
	});
});
