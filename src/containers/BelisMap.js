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
	setBoundingBoxAndLoadObjects
} from '../core/store/slices/mapping';
import { getLoadingState } from '../core/store/slices/spatialIndex';
import FocusRectangle from '../components/app/FocusRectangle';
import BelisFeatureCollection from '../components/app/FeatureCollection';
import { backgrounds } from '../constants/belis';
import { getFeatureCollection } from '../core/store/slices/featureCollection';

//---

const BelisMap = ({ refRoutedMap, width, height, background, inFocusMode, inPaleMode }) => {
	const mapStyle = {
		height,
		width,
		cursor: 'pointer',
		clear: 'both'
	};
	const featureCollection = useSelector(getFeatureCollection);
	const history = useHistory();
	const browserlocation = useLocation();
	const urlSearchParams = new URLSearchParams(browserlocation.search);
	const resultingLayer = backgrounds[(inPaleMode === true ? 'pale_' : '') + background];

	return (
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
};

export default BelisMap;
