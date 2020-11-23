import React, { useEffect, useState } from 'react';

import demoworker from 'workerize-loader!./demo'; // eslint-disable-line import/no-webpack-loader-syntax
import { calculatePrimes } from './demo';
const workerInstance = demoworker();
const C = () => {
	const [ primes, setPrimes ] = useState([]);
	const [ rand, setRand ] = useState([]);
	useEffect(() => {
		workerInstance.addEventListener('message', (message) => {
			if (message.data.primes !== undefined) {
				setPrimes(message.data.primes);
			}
			if (message.data.rand !== undefined) {
				setRand(message.data.rand);
			}
			if (message.data.debugLog !== undefined) {
				console.log(message.data.debugLog);
			}
		});
		// Run your calculations
		//	workerInstance.calculatePrimes(500, 1000000000);
	}, []);

	return (
		<div>
			<h1>Worker Test</h1>
			{/* <button
				onClick={() => {
					console.log('click');

					workerInstance.calculatePrimes(500, 1000000000);
				}}
			>
				startPrimes()
			</button> */}
			<p>{rand}</p>
			{/* <button
				onClick={() => {
					console.log('click');

					workerInstance.stopPrimes();
				}}
			>
				stopPrimes()
			</button> */}
			<button
				onClick={() => {
					console.log('click');

					workerInstance.getRand1();
				}}
			>
				rand1()
			</button>
			<button
				onClick={() => {
					console.log('click');

					workerInstance.getRand2();
				}}
			>
				rand2()
			</button>
		</div>
	);
};
export default C;
