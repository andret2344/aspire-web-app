import React from 'react';
import {useTranslation} from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Accordion, AccordionDetails, AccordionSummary, Box, Container, Typography} from '@mui/material';

type FaqItem = {q: string; a: string};

function getDetails(item: FaqItem, idx: number): React.JSX.Element {
	return (
		<Accordion key={idx}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography variant='h6'>{item.q}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography variant='body1'>{item.a}</Typography>
			</AccordionDetails>
		</Accordion>
	);
}

export function FaqPage(): React.ReactElement {
	const {t: faq} = useTranslation('faq');
	const {t} = useTranslation();

	const items = faq('items', {returnObjects: true}) as FaqItem[];

	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%'
			}}
		>
			<Typography
				variant='h2'
				textAlign='center'
				component='p'
				sx={{
					py: '2.5rem'
				}}
			>
				{faq('description')}
			</Typography>
			<Box
				sx={{
					overflow: 'auto',
					flex: 1
				}}
			>
				{items.map(getDetails)}
			</Box>
		</Container>
	);
}
