import React from 'react';

interface ConditionProps {
	readonly check: boolean;
}

export function Condition(props: React.PropsWithChildren<ConditionProps>): React.ReactNode {
	if (props.check) {
		return props.children;
	}
	return <></>;
}
