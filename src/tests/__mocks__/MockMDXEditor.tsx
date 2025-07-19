import React from 'react';

export const mockedSetMarkdown: jest.Mock = jest.fn();
export const mockedGetMarkdown: jest.Mock = jest.fn();

jest.mock('@mdxeditor/editor', () => ({
	// eslint-disable-next-line react/display-name
	MDXEditor: React.forwardRef(
		(): React.ReactElement => <div data-testid='mock-mdx-editor' />
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
	toolbarPlugin: () => () => null,

	// Optional: mock the ref behavior
	MDXEditorMethods: class {
		setMarkdown = mockedSetMarkdown;
		getMarkdown = mockedGetMarkdown;
	}
}));
