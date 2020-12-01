import {
	faCalendar,
	faCalendarAlt,
	faCheckCircle,
	faCheckSquare,
	faDatabase,
	faDownload,
	faQuestionCircle,
	faSpinner,
	faSync,
	faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';

const getIconForLoadingState = (ls) => {
	if (ls === 'loading') {
		return <Icon spin icon={faSpinner} />;
	} else if (ls === 'caching') {
		return <Icon spin icon={faDatabase} />;
	} else if (ls === 'cached') {
		return <Icon icon={faCheckSquare} />;
	} else {
		return <Icon icon={faQuestionCircle} />;
	}
};

const CacheItem = ({ control, renew, refresh = () => {} }) => {
	const {
		name,
		key,
		lastUpdate,
		loadingState,
		objectCount,
		updateCount,
		cachingProgress
	} = control;

	const controls = (
		<td style={{ width: 120, whiteSpace: 'nowrap' }}>
			<Button
				style={{ margin: 3 }}
				variant='outline-primary'
				size='sm'
				onClick={() => {
					renew();
				}}
			>
				<Icon icon={faDownload} />
			</Button>

			<Button
				style={{ margin: 3 }}
				variant='outline-success'
				onClick={() => {
					renew();
				}}
				ize='sm'
			>
				<Icon icon={faSync} />
			</Button>
		</td>
	);

	const counts = <td style={{ textAlign: 'right' }}>{objectCount}</td>;
	const cols = [];
	cols[0] = controls;
	cols[1] = counts;

	if (loadingState === undefined) {
		cols[3] = <td style={{ textAlign: 'left', width: '100%' }}>{name}</td>;
		cols[4] = (
			<td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
				<Icon icon={faCalendarAlt} /> {getUpdateString(lastUpdate)}
			</td>
		);
	} else if (loadingState === 'loading') {
		// setStartTime(new Date().getTime());
		cols[3] = <td style={{ textAlign: 'left', width: '100%' }}>{name}</td>;
		cols[4] = (
			<td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
				<Icon spin icon={faSpinner} /> laden
			</td>
		);
	} else if (loadingState === 'caching') {
		cols[3] = (
			<td style={{ textAlign: 'left', width: '100%' }}>
				<ProgressBar animated now={cachingProgress} label={name} max={updateCount} />
			</td>
		);
		cols[4] = (
			<td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
				<Icon spin icon={faSpinner} /> {updateCount} schreiben
			</td>
		);
	} else if (loadingState === 'cached') {
		cols[3] = (
			<td style={{ textAlign: 'left', width: '100%' }}>
				<ProgressBar now={updateCount} label={name} max={updateCount} />
			</td>
		);
		cols[4] = (
			<td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
				<Icon icon={faCheckCircle} /> {updateCount} geschrieben
			</td>
		);
	}
	return <tr>{cols}</tr>;
};

export const getUpdateString = (lastUpdate) => {
	if (lastUpdate > 0) {
		const d = new Date(lastUpdate);
		const hh = (d.getHours() + '').padStart(2, '0');
		const mm = (d.getMinutes() + '').padStart(2, '0');
		return hh + ':' + mm;
	} else {
		return '?';
	}
};

export default CacheItem;
