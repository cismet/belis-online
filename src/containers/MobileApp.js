import React, { useRef, useState } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import useComponentSize from '@rehooks/component-size';
import useOnlineStatus from '@rehooks/online-status';
import { useDispatch, useSelector } from 'react-redux';
import BottomNavbar from './BottomNavbar';
import MapBlocker from '../components/app/MapBlocker';
import TopNavbar from './TopNavbar';
import CacheSettings from '../components/CacheSettings';
import useLocalStorage from '../core/commons/hooks/useLocalStorage';
import {
	getFeatureCollection,
	getFilter,
	isDone,
	isInFocusMode
} from '../core/store/slices/featureCollection';
import BelisMap from './BelisMap';
import { getBackground } from '../core/store/slices/background';

//---

const View = () => {
	const dispatch = useDispatch();
	const [ windowWidth, windowHeight ] = useWindowSize();
	const onlineStatus = useOnlineStatus();

	let refRoutedMap = useRef(null);
	let refUpperToolbar = useRef(null);
	let sizeU = useComponentSize(refUpperToolbar);
	let refLowerToolbar = useRef(null);
	let sizeL = useComponentSize(refLowerToolbar);

	const mapStyle = {
		height: windowHeight - (sizeU.height || 62) - (sizeL.height || 56),
		width: windowWidth,
		cursor: 'pointer',
		clear: 'both'
	};

	//local state
	const [ cacheSettingsVisible, setCacheSettingsVisible ] = useState(false);

	const fcIsDone = useSelector(isDone);
	return (
		<div>
			{cacheSettingsVisible === true && (
				<CacheSettings
					hide={() => {
						setCacheSettingsVisible(false);
					}}
				/>
			)}
			<TopNavbar
				innerRef={refUpperToolbar}
				refRoutedMap={refRoutedMap}
				setCacheSettingsVisible={setCacheSettingsVisible}
			/>
			<MapBlocker
				blocking={fcIsDone === false}
				visible={false}
				width={windowWidth}
				height={windowHeight}
			/>
			<BelisMap refRoutedMap={refRoutedMap} width={mapStyle.width} height={mapStyle.height} />
			<BottomNavbar
				innerRef={refLowerToolbar}
				onlineStatus={onlineStatus}
				refRoutedMap={refRoutedMap}
			/>
		</div>
	);
};

export default View;
