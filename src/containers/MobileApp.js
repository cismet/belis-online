import React, { useEffect, useRef, useState } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import useComponentSize from '@rehooks/component-size';
import useOnlineStatus from '@rehooks/online-status';
import bboxPolygon from '@turf/bbox-polygon';
import { FeatureCollectionDisplay, MappingConstants, RoutedMap } from 'react-cismap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import BottomNavbar from '../components/app/BottomNavbar';
import MapBlocker from '../components/app/MapBlocker';
import TopNavbar from '../components/app/TopNavbar';
import CacheSettings from '../components/CacheSettings';
import useLocalStorage from '../core/commons/hooks/useLocalStorage';
import { modifyQueryPart } from '../core/commons/routingHelper';
import {
	getBoundingBox,
	getFilter,
	setBoundingBoxAndLoadObjects,
	isDone
} from '../core/store/slices/mapping';

import { getLoadingState } from '../core/store/slices/spatialIndex';
import FocusRectangle from '../components/app/FocusRectangle';
import BelisFeatureCollection from '../components/app/FeatureCollection';
import { backgrounds } from '../constants/belis';
import { getFeatureCollection } from '../core/store/slices/featureCollection';
import DebugFeature from '../components/app/DebugFocusRectangle';
//---

const focusedSearchMinimumZoomThreshhold = 12.5;
const searchMinimumZoomThreshhold = 13.5;

// const focusedSearchMinimumZoomThreshhold = 2.5;
// const searchMinimumZoomThreshhold = 3.5;

const View = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const browserlocation = useLocation();
	const urlSearchParams = new URLSearchParams(browserlocation.search);
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
	const [ inFocusMode, setFocusModeActive ] = useLocalStorage('@belis.app.inFocusMode', false);
	const [ inPaleMode, setPaleModeActive ] = useLocalStorage('@belis.app.inPaleMode', false);
	const [ inSearchMode, setSearchModeActive ] = useLocalStorage('@belis.app.inSearchMode', true);
	const [ wouldLikeToBeInSearchMode, setSearchModeWish ] = useLocalStorage(
		'@belis.app.wouldLikeToBeInSearchMode',
		true
	);
	const [ showObjectBB, setShowObjectBB ] = useState();
	// const [ filterState, setFilterState ] = useLocalStorage('@belis.app.filterState', );

	const [ cacheSettingsVisible, setCacheSettingsVisible ] = useState(false);
	const [ focusBoundingBox, setFocusBoundingBox ] = useState(undefined);
	// const [ fcIsDone, setFCIsDone ] = useState(true);
	// const fcIsDoneRef = useRef(null);
	const [ mapBlockerVisible, setMapBlockerVisible ] = useState(false);

	// vars from redux state
	// const featureCollection = fc;
	const featureCollection = useSelector(getFeatureCollection);
	const fcIsDone = useSelector(isDone);
	const fcIsDoneRef = useRef(null);

	const loadingState = useSelector(getLoadingState);
	const filterState = useSelector(getFilter);

	useEffect(
		() => {
			fcIsDoneRef.current = fcIsDone;
			if (fcIsDone === true) {
				setMapBlockerVisible(false);
			} else {
				setTimeout(() => {
					setMapBlockerVisible(fcIsDoneRef.current === false);
				}, 250);
			}
		},
		[ fcIsDone ]
	);

	const isSearchForbidden = (overrides = {}) => {
		let zoom = overrides.zoom || getZoom();
		let ifm; //= overrides.inFocusMode || inFocusMode;
		if (overrides.inFocusMode !== undefined) {
			ifm = overrides.inFocusMode;
		} else {
			ifm = inFocusMode;
		}
		return (
			(ifm === true && zoom < focusedSearchMinimumZoomThreshhold) ||
			(ifm === false && zoom < searchMinimumZoomThreshhold)
		);
	};

	const getZoom = () => {
		return urlSearchParams.get('zoom');
		// try {
		// 	const routedMap = refRoutedMap.current;
		// 	const leafletMap = routedMap.leafletMap;
		// 	return leafletMap.leafletElement.getZoom();
		// } catch (e) {
		// 	//console.log('xxx urlSearchParams', urlSearchParams);

		// 	//console.log('xxx error in get zoom ', e);
		// }
		// return -1;
	};

	const resultingLayer = backgrounds[(inPaleMode === true ? 'pale_' : '') + background];
	// console.log('resultingLayer index', (pale === true ? 'pale_' : '') + background);
	// console.log('resultingLayer', resultingLayer);

	const boundingBoxChangedHandler = (incomingBoundingBox) => {
		let bb = incomingBoundingBox;
		if (bb === undefined) {
			bb = refRoutedMap.current.getBoundingBox();
		}

		const _searchForbidden = isSearchForbidden();
		//console.log('xxx searchForbidden', _searchForbidden);
		//console.log('xxx inSearchMode', inSearchMode);
		//console.log('xxx wouldLikeToBeInSearchMode', wouldLikeToBeInSearchMode);

		if (_searchForbidden === true && inSearchMode === true) {
			setSearchModeWish(true);
			setSearchModeActive(false);
		} else if (
			_searchForbidden === false &&
			wouldLikeToBeInSearchMode === true &&
			inSearchMode === false
		) {
			//console.log('xxx after +');

			setSearchModeWish(true);
			setSearchModeActive(true);
			showObjects(bb, inFocusMode);
		} else if (_searchForbidden === false && inSearchMode === true) {
			setSearchModeWish(true);
			showObjects(bb, inFocusMode);
		}
	};

	const showObjects = (bb, inFocusMode, retried = 0) => {
		const zoom = getZoom();

		if (zoom === -1) {
			// //console.log('xxx try again #', retried);
			if (retried < 5) {
				setTimeout(() => {
					showObjects(bb, inFocusMode, retried + 1);
				}, 10);
				return;
			}
		}
		const _searchForbidden = isSearchForbidden({ inFocusMode });

		if (_searchForbidden === true && inSearchMode === true) {
			setSearchModeWish(true);
			setSearchModeActive(false);
		} else if (
			_searchForbidden === false &&
			wouldLikeToBeInSearchMode === true &&
			inSearchMode === false
		) {
			setSearchModeWish(true);
			setSearchModeActive(true);
			forceShowObjects(bb, inFocusMode);
		} else if (_searchForbidden === false && inSearchMode === true) {
			setSearchModeWish(true);
			forceShowObjects(bb, inFocusMode);
		}
	};

	const forceShowObjects = (bb, inFocusMode, retried = 0) => {
		if (JSON.stringify(bb) !== JSON.stringify(showObjectBB)) {
			setShowObjectBB(bb);
			let geom = bboxPolygon([ bb.left, bb.top, bb.right, bb.bottom ]).geometry;
			geom.srs = 25832;

			const w = bb.right - bb.left;
			const h = bb.top - bb.bottom;
			const focusBoundingBoxGeom = bboxPolygon([
				bb.left + w / 4,
				bb.top - h / 4,
				bb.right - w / 4,
				bb.bottom + h / 4
			]);
			// const focusBoundingBoxGeom = bboxPolygon([ bb.left, bb.top, bb.right, bb.bottom ]);
			focusBoundingBoxGeom.crs = {
				type: 'name',
				properties: {
					name: 'urn:ogc:def:crs:EPSG::25832'
				}
			};
			setFocusBoundingBox(focusBoundingBoxGeom);

			const focusBB = {
				left: bb.left + w / 4,
				top: bb.top - h / 4,
				right: bb.right - w / 4,
				bottom: bb.bottom + h / 4
			};

			let xbb;
			if (inFocusMode) {
				xbb = focusBB;
			} else {
				xbb = bb;
			}

			//console.log('xxx ');

			dispatch(setBoundingBoxAndLoadObjects(xbb));
		} else {
			//console.log('xxx duplicate forceShowObjects');
		}
	};

	const map = (
		<RoutedMap
			editable={false}
			style={mapStyle}
			key={'leafletRoutedMap.' + inPaleMode + '.' + background}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			ref={refRoutedMap}
			layers=''
			doubleClickZoom={false}
			onclick={(e) => console.log('click', e)}
			ondblclick={(e) => console.log('doubleclick', e)}
			autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
			backgroundlayers={resultingLayer}
			urlSearchParams={urlSearchParams}
			fullScreenControlEnabled={false}
			locateControlEnabled={false}
			minZoom={7}
			maxZoom={18}
			zoomSnap={0.5}
			zoomDelta={0.5}
			locationChangedHandler={(location) => {
				history.push(
					history.location.pathname + modifyQueryPart(browserlocation.search, location)
				);
			}}
			boundingBoxChangedHandler={boundingBoxChangedHandler}
		>
			<BelisFeatureCollection featureCollection={featureCollection} />
			{/* <DebugFeature feature={focusBoundingBox} /> */}
			<FocusRectangle
				inFocusMode={inFocusMode}
				mapWidth={mapStyle.width}
				mapHeight={mapStyle.height}
			/>
		</RoutedMap>
	);
	// console.log('yyy fcIsDone', fcIsDone);

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
				inSearchMode={inSearchMode}
				featureCollection={featureCollection}
				searchForbidden={isSearchForbidden()}
				setSearchModeActive={setSearchModeActive}
				setSearchModeWish={setSearchModeWish}
				showObjects={showObjects}
				refRoutedMap={refRoutedMap}
				inFocusMode={inFocusMode}
				filterState={filterState}
				dispatch={dispatch}
				setCacheSettingsVisible={setCacheSettingsVisible}
			/>
			<MapBlocker
				blocking={fcIsDone === false}
				visible={mapBlockerVisible}
				width={windowWidth}
				height={windowHeight}
			/>
			{map}
			<BottomNavbar
				innerRef={refLowerToolbar}
				background={background}
				onlineStatus={onlineStatus}
				inFocusMode={inFocusMode}
				setFocusModeActive={setFocusModeActive}
				showObjects={showObjects}
				refRoutedMap={refRoutedMap}
				inPaleMode={inPaleMode}
				setPaleModeActive={setPaleModeActive}
				setBackground={setBackground}
			/>
		</div>
	);
};

export default View;
