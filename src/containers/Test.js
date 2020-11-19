import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { initIndex, getPointIndex, getLoadingState } from '../core/store/slices/spatialIndex';
import testSlice, { getCounter, inc, dec } from '../core/store/slices/test';

const Test = () => {
	const dispatch = useDispatch();
	const index = useSelector(getPointIndex);
	const loadingState = useSelector(getLoadingState);
	const counter = useSelector(getCounter);

	useEffect(
		() => {
			if (loadingState === undefined) {
				dispatch(initIndex());
			}
		},
		[ loadingState ]
	);

	let indexInfo;
	if (index && index.points && index.points.length) {
		indexInfo = index.points.length + ' Elements';
	} else {
		indexInfo = 'not initited';
	}
	return (
		<div>
			<div>Index ({indexInfo})</div>
			<h2>{counter}</h2>
			<button
				onClick={() => {
					dispatch(testSlice.actions.inc());
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					dispatch(testSlice.actions.dec());
				}}
			>
				-
			</button>
			<div>
				<button
					onClick={() => {
						dispatch(initIndex());
					}}
				>
					initialize Index
				</button>
			</div>
		</div>
	);
};
export default Test;
