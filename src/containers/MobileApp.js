import { useWindowSize } from '@react-hook/window-size';
import useComponentSize from '@rehooks/component-size';
import useOnlineStatus from '@rehooks/online-status';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapBlocker from '../components/app/MapBlocker';
import CacheSettings from '../components/CacheSettings';
import { CONNECTIONMODE, getConnectionMode } from '../core/store/slices/app';
import { isDone } from '../core/store/slices/featureCollection';
import BelisMap from './BelisMap';
import BottomNavbar from './BottomNavbar';
import TopNavbar from './TopNavbar';

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
	const connectionMode = useSelector(getConnectionMode);

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
				visible={true || connectionMode === CONNECTIONMODE.ONLINE}
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
