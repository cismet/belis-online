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
		height: windowHeight - sizeU.height - sizeL.height,
		width: windowWidth,
		cursor: 'pointer',
		clear: 'both'
	};

	//local state
	const [ background, setBackground ] = useLocalStorage(
		'@belis.app.backgroundlayer',
		'stadtplan'
	);
	const [ inPaleMode, setPaleModeActive ] = useLocalStorage('@belis.app.inPaleMode', false);

	const [ cacheSettingsVisible, setCacheSettingsVisible ] = useState(false);

	const featureCollection = useSelector(getFeatureCollection);
	const fcIsDone = useSelector(isDone);
	const filterState = useSelector(getFilter);
	const inFocusMode = useSelector(isInFocusMode);
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
				background={background}
				fcIsDone={fcIsDone}
				featureCollection={featureCollection}
				refRoutedMap={refRoutedMap}
				filterState={filterState}
				dispatch={dispatch}
				setCacheSettingsVisible={setCacheSettingsVisible}
			/>
			<MapBlocker
				blocking={fcIsDone === false}
				visible={false}
				width={windowWidth}
				height={windowHeight}
			/>
			<BelisMap
				refRoutedMap={refRoutedMap}
				width={mapStyle.width}
				height={mapStyle.height}
				background={background}
				inFocusMode={inFocusMode}
				inPaleMode={inPaleMode}
			/>
			<BottomNavbar
				innerRef={refLowerToolbar}
				background={background}
				onlineStatus={onlineStatus}
				refRoutedMap={refRoutedMap}
				inPaleMode={inPaleMode}
				setPaleModeActive={setPaleModeActive}
				setBackground={setBackground}
			/>
		</div>
	);
};

export default View;
