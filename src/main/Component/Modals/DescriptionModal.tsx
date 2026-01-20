import React, {RefObject} from 'react';
import {useTranslation} from 'react-i18next';
import {Box, Button, CircularProgress} from '@mui/material';
import {useDarkMode} from '@context/DarkModeContext';
import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CreateLink,
	headingsPlugin,
	InsertTable,
	InsertThematicBreak,
	ListsToggle,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	MDXEditorMethods,
	markdownShortcutPlugin,
	quotePlugin,
	Separator,
	StrikeThroughSupSubToggles,
	tablePlugin,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo
} from '@mdxeditor/editor';
import {AspireModal} from './AspireModal';

interface DescriptionModalProps {
	readonly open: boolean;
	readonly loading?: boolean;
	readonly defaultDescription?: string;
	readonly onAccept: (description: string) => void;
	readonly onClose: () => void;
}

export function DescriptionModal(props: DescriptionModalProps): React.ReactElement {
	const descriptionEditorRef: RefObject<MDXEditorMethods | null> = React.useRef<MDXEditorMethods | null>(null);

	const {darkMode} = useDarkMode();
	const {t} = useTranslation();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		const description: string = descriptionEditorRef.current?.getMarkdown() ?? '';
		props.onAccept(description);
	}

	function renderToolbarContents(): React.ReactElement {
		return (
			<>
				<UndoRedo />
				<Separator />
				<BoldItalicUnderlineToggles />
				<Separator />
				<BlockTypeSelect />
				<Separator />
				<CreateLink />
				<InsertTable />
				<InsertThematicBreak />
				<Separator />
				<StrikeThroughSupSubToggles />
				<Separator />
				<ListsToggle options={['number', 'bullet']} />
			</>
		);
	}

	function renderButtonContent(): React.ReactElement | string {
		if (props.loading) {
			return <CircularProgress size={18} />;
		}
		return t('confirm');
	}

	function handleClose(): void {
		if (!props.loading) {
			props.onClose();
		}
	}

	return (
		<AspireModal
			onClose={handleClose}
			open={props.open}
			title={t('description')}
			onSubmit={handleSubmit}
			maxWidth='80%'
			width='auto'
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-between',
					width: {
						xs: '100%',
						md: '90%'
					}
				}}
			>
				<MDXEditor
					contentEditableClassName='mdx-editor'
					className={`mdxeditor-mobile mdxeditor ${darkMode ? 'dark-theme' : ''}`}
					markdown={props.defaultDescription ?? ''}
					plugins={[
						headingsPlugin({
							allowedHeadingLevels: [1, 2, 3, 4, 5, 6]
						}),
						listsPlugin(),
						tablePlugin(),
						linkPlugin(),
						linkDialogPlugin(),
						quotePlugin(),
						markdownShortcutPlugin(),
						thematicBreakPlugin(),
						toolbarPlugin({
							toolbarClassName: 'my-classname',
							toolbarContents: renderToolbarContents
						})
					]}
					ref={descriptionEditorRef}
					placeholder={t('type-description-here')}
				/>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						width: '80%',
						alignItems: 'center',
						padding: '10px'
					}}
				>
					<Button
						data-testid='modal-description-confirm'
						type='submit'
						variant='contained'
						disabled={props.loading}
						sx={{
							margin: '0 20px'
						}}
					>
						{renderButtonContent()}
					</Button>
					<Button
						data-testid='modal-description-cancel'
						variant='outlined'
						color='error'
						disabled={props.loading}
						onClick={handleClose}
						sx={{
							margin: '0 20px'
						}}
					>
						{t('cancel')}
					</Button>
				</Box>
			</Box>
		</AspireModal>
	);
}
