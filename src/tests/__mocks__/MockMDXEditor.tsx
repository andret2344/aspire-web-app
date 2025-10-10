import React, {ForwardedRef} from 'react';
import {MDXEditorMethods, MDXEditorProps} from '@mdxeditor/editor';

export const mockedSetMarkdown: jest.Mock = jest.fn();
export const mockedGetMarkdown: jest.Mock = jest.fn();

jest.mock('@mdxeditor/editor', () => ({
	// eslint-disable-next-line react/display-name
	MDXEditor: React.forwardRef(
		(
			props: React.PropsWithChildren<MDXEditorProps>,
			ref: ForwardedRef<unknown>
		): React.ReactElement => {
			if (ref) {
				// eslint-disable-next-line react-hooks/refs
				(ref as React.RefObject<MDXEditorMethods | null>).current = {
					getMarkdown: mockedGetMarkdown,
					setMarkdown: mockedSetMarkdown,
					insertMarkdown: jest.fn(),
					focus: jest.fn()
				};
			}

			return (
				<div
					data-testid='mock-mdx-editor'
					className={`${props.contentEditableClassName} ${props.className}`}
					contentEditable
				>
					{props.children}
				</div>
			);
		}
	),
	BlockTypeSelect: () => <div data-testid='mock-block-type' />,
	BoldItalicUnderlineToggles: () => <div data-testid='mock-toggles' />,
	CreateLink: () => <div data-testid='mock-create-link' />,
	InsertTable: () => <div data-testid='mock-insert-table' />,
	InsertThematicBreak: () => <div data-testid='mock-insert-break' />,
	ListsToggle: () => <div data-testid='mock-lists-toggle' />,
	Separator: () => <div data-testid='mock-separator' />,
	UndoRedo: () => <div data-testid='mock-undo-redo' />,

	headingsPlugin: () => () => null,
	listsPlugin: () => () => null,
	tablePlugin: () => () => null,
	linkPlugin: () => () => null,
	linkDialogPlugin: () => () => null,
	quotePlugin: () => () => null,
	markdownShortcutPlugin: () => () => null,
	thematicBreakPlugin: () => () => null,
	toolbarPlugin: jest.fn((config) => ({
		toolbarContents: config.toolbarContents
	})),

	// Optional: mock the ref behavior
	MDXEditorMethods: class {
		setMarkdown = mockedSetMarkdown;
		getMarkdown = mockedGetMarkdown;
	}
}));
