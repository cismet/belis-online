import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { initIndex } from '../core/store/slices/spatialIndex';

const Test = () => {
	const dispatch = useDispatch();
	return (
		<div
			onClick={() => {
				console.log('initIndex');

				dispatch(initIndex());
			}}
		>
			Test
		</div>
	);
};
export default Test;
