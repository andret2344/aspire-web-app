import React from 'react';

type MarkdownProps = {
	children?: React.ReactNode;
	components?: {
		a?: React.ComponentType<any>;
		[key: string]: React.ComponentType<any> | undefined;
	};
};

export default (props: MarkdownProps): React.ReactElement => {
	const content = props.children as string;
	const linkMatch = content.match(/\[([^\]]+)\]\(([^)]+)\)/);

	if (linkMatch && props.components?.a) {
		const LinkComponent = props.components.a;
		const [, text, url] = linkMatch;
		return (
			<div data-testid='mock-react-markdown'>
				<LinkComponent href={url}>{text}</LinkComponent>
			</div>
		);
	}

	return (
		<div
			data-testid='mock-react-markdown'
			dangerouslySetInnerHTML={{__html: content}}
		/>
	);
};
