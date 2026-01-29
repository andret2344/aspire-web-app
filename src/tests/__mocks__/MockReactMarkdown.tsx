import React from 'react';

type AnchorType = React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

interface MarkdownProps {
	components?: {
		a?: AnchorType;
		[key: string]: AnchorType | undefined;
	};
}

export default (props: React.PropsWithChildren<MarkdownProps>): React.ReactElement => {
	const content = props.children as string;
	const linkMatch = content.match(/\[([^\]]+)]\(([^)]+)\)/);

	if (linkMatch && props.components?.a) {
		const LinkComponent: AnchorType = props.components.a;
		const [, text, url] = linkMatch;
		return (
			<div data-testid='mock-react-markdown'>
				<LinkComponent
					href={url}
					target={undefined}
					rel={undefined}
				>
					{text}
				</LinkComponent>
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
