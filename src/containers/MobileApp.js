import { useWindowSize } from '@react-hook/window-size';
import useComponentSize from '@rehooks/component-size';
import useOnlineStatus from '@rehooks/online-status';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapBlocker from '../components/app/MapBlocker';
import CacheSettings from '../components/CacheSettings';
import { CONNECTIONMODE, getConnectionMode } from '../core/store/slices/app';
import { isDone } from '../core/store/slices/featureCollection';
import BelisMap from './BelisMap';
import BottomNavbar from './BottomNavbar';
import TopNavbar from './TopNavbar';
import SideBar from './SideBar';
import LoginForm from "../components/app/LoginForm";

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
	let refSideBar = useRef(null);
	let sizeSide = useComponentSize(refSideBar);

	const mapStyle = {
		height: windowHeight - (sizeU.height || 62) - (sizeL.height || 56),
		width: windowWidth - (sizeSide.width || 300),
		cursor: 'pointer',
		clear: 'both'
	};

	//local state
	const [ cacheSettingsVisible, setCacheSettingsVisible ] = useState(false);
	const [ loginInfo, setLoginInfo ] = useState();
	const [ jwt, setJwt ] = useState();
	const [ loggedOut, setLoggedOut ] = useState();
//	let jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIwIiwic3ViIjoiYWRtaW4iLCJkb21haW4iOiJXVU5EQV9CTEFVIn0.E3eZbW0lp6QrEyaDuGgtKpUqwi7WBp-mChecAej2wqutBcXD6utYCiKeAUMar5kIjgKdiZG5v7R-0uUekeTOp6_MuEysuGL4l-61VKLJwl31Tiw40JIzB3_saVky9bfZ_ntnR6Fkb4FuXe0T1Y2qqKwZd0NI-pCzLb98K6AQn41p7_LunusIxAewXUZm20UtsMhSYDNBLqVqi1GYiv_knNKo1iWnFPT37FuF_Rsx9MkWToHuRFXg1J790ghaJQRH5ky1xNYjiOhdK0k5E4zSZBXI7xnuK0fGdjGnJ2wVkfdGDb65e5H3EP3MEiBX1qRpCDEBstq_bOrKs-MTo464sQ'

	const fcIsDone = useSelector(isDone);
	const connectionMode = useSelector(getConnectionMode);

	useEffect(() => {
	}, [jwt]);

	let loginForm = null;
	if (jwt === undefined) {
		loginForm = (
			<LoginForm key={"login."} setJWT={setJwt} loginInfo={loginInfo} setLoginInfo={setLoginInfo}  setLoggedOut={setLoggedOut} />
		);
	}

	return (
		<div>
			{cacheSettingsVisible === true && (
				<CacheSettings
					hide={() => {
						setCacheSettingsVisible(false);
					}}

					jwt={jwt}
				/>
			)}
			{jwt === undefined && loginForm}
			<TopNavbar
				innerRef={refUpperToolbar}
				refRoutedMap={refRoutedMap}
				setCacheSettingsVisible={setCacheSettingsVisible}
				jwt={jwt}
			/>
			<SideBar
				innerRef={refSideBar}
				refRoutedMap={refRoutedMap}
				setCacheSettingsVisible={setCacheSettingsVisible}
				height={mapStyle.height}
			/>
			<MapBlocker
				blocking={fcIsDone === false}
				visible={true || connectionMode === CONNECTIONMODE.ONLINE}
				width={windowWidth}
				height={windowHeight}
				
			/>
			<BelisMap refRoutedMap={refRoutedMap} width={mapStyle.width} height={mapStyle.height} jwt={jwt} />
			<BottomNavbar
				innerRef={refLowerToolbar}
				onlineStatus={onlineStatus}
				refRoutedMap={refRoutedMap}
				jwt={jwt}
			/>
		</div>
	);
};

export default View;
