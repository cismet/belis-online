import React, { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import demoworker from 'workerize-loader!./dexie'; // eslint-disable-line import/no-webpack-loader-syntax
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

const workerInstance = demoworker();

const getty = async () => {
	try {
		const result = await workerInstance.get(1);
		console.log('outer result', result);
	} catch (err) {
		console.log('err', err);
	}
};
const C = () => {
	const [ content, setContent ] = useState([]);
	const [ progress, setProgress ] = useState(0);
	const [ progressMax, setProgressMax ] = useState(100);
	useEffect(() => {
		workerInstance.addEventListener('message', (message) => {
			if (message.data.debugLog !== undefined) {
				let d = message.data;
				const debugLogMessage = message.data.debugLog;
				delete d.debugLog;
				if (JSON.stringify(d) === '{}') {
					console.log(debugLogMessage);
				} else {
					console.log(debugLogMessage, d);
				}
			}
			if (message.data.progress !== undefined) {
				setProgress(message.data.progress);
			}
		});
	}, []);

	return (
		<div>
			<h1>Worker Test</h1>
			<p style={{ fontSize: 90 }}>
				<Icon spin icon={faSpinner} />
			</p>
			<p>
				<pre>{content}</pre>
			</p>

			<Button
				onClick={() => {
					(async () => {
						const result = await workerInstance.init();
						console.log('result0', result);
					})();
				}}
			>
				init()
			</Button>
			<Button
				onClick={() => {
					(async () => {
						const result = await workerInstance.isInited();
						console.log('result', result);
					})();
				}}
			>
				isInited()
			</Button>
			<Button
				onClick={() => {
					(async () => {
						const result = await workerInstance.put(
							{ id: 1, name: 'thorsten' },
							'_test'
						);
						console.log('result', result);
					})();
				}}
			>
				put()
			</Button>
			<Button
				onClick={() => {
					(async () => {
						const array = [];
						let i = 0;
						let mx = 100;
						setProgressMax(mx);
						setProgress(0);
						for (i = 0; i < mx; i++) {
							array.push({ id: i, name: 'thorsten.' + i });
						}
						console.log('putall');

						const result = await workerInstance.putArray(array, '_test');
						console.log('result', result);
					})();
				}}
			>
				putArray()
			</Button>
			<Button
				onClick={() => {
					(async () => {
						const x = await workerInstance.get(1, '_test');
						console.log('here', x);
					})();

					// getty();
				}}
			>
				get("1")
			</Button>

			<center>
				{' '}
				<ProgressBar
					style={{ width: '50%', margin: 100 }}
					animated
					now={progress}
					max={progressMax}
				/>
			</center>
			{/* <button
				onClick={() => {
					const request = indexedDB.open('WorkerTestDB', 1);
					request.onupgradeneeded = (event) => {
						let db = event.target.result;
						let objectStore = db.createObjectStore('user', {
							keyPath: 'id',
							autoIncrement: true
						});
						console.log('upgrade was needed');
					};
					request.onsuccess = (event) => {
						let db = request.result;
						const transaction = db.transaction('user', 'readwrite');
						const store = transaction.objectStore('user');
						const r = store.add({ id: 1, name: 'thorsten' });
						r.onsuccess = (event) => {
							console.log('success', event);
						};
						r.onerror = (event) => {
							console.log('error', event.target.error);
						};
					};
				}}
			>
				localAddFixed()
			</button> */}
		</div>
	);
};
export default C;
