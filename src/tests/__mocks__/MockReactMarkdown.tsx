import React from 'react';

export default (props: {children?: React.ReactNode}): React.ReactElement => (
	<div
		data-testid='mock-react-markdown'
		dangerouslySetInnerHTML={{__html: props.children as string}}
	/>
);
