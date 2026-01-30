import React from 'react';
import {useTranslation} from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Accordion, AccordionDetails, AccordionSummary, Container, Typography} from '@mui/material';

type FaqItem = {q: string; a: string};

export function FaqPage(): React.ReactElement {
	const {t: faq} = useTranslation('faq');
	const {t} = useTranslation();

	const items = faq('items', {returnObjects: true}) as FaqItem[];

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

	return (
		<Container
			sx={{
				paddingTop: '56px'
			}}
		>
			<Typography
				variant='h2'
				textAlign='center'
				component='p'
			>
				{t('faq-title')}
			</Typography>

			{items.map(getDetails)}
		</Container>
	);
}
