import React from 'react';
import { MappingConstants, RoutedMap } from 'react-cismap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import BelisFeatureCollection from '../components/app/FeatureCollection';
import FocusRectangle from '../components/app/FocusRectangle';
import { backgrounds } from '../constants/belis';
import { modifyQueryPart } from '../core/commons/routingHelper';
import { getConnectionMode } from '../core/store/slices/app';
import { getBackground } from '../core/store/slices/background';
import {
	getFeatureCollection,
	loadObjects,
	isInFocusMode
} from '../core/store/slices/featureCollection';
import { isPaleModeActive } from '../core/store/slices/paleMode';
import { getZoom, setZoom } from '../core/store/slices/zoom';

//---

const BelisMap = ({ refRoutedMap, width, height }) => {
	const dispatch = useDispatch();

	const mapStyle = {
		height,
		width,
		cursor: 'pointer',
		clear: 'both',
		display: 'flex'
	};
	const featureCollection = useSelector(getFeatureCollection);
	const inFocusMode = useSelector(isInFocusMode);
	const history = useHistory();
	const browserlocation = useLocation();

	const zoom = useSelector(getZoom);
	const inPaleMode = useSelector(isPaleModeActive);
	const background = useSelector(getBackground);
	const connectionMode = useSelector(getConnectionMode);

	const urlSearchParams = new URLSearchParams(browserlocation.search);

	const rlKey = (inPaleMode === true ? 'pale_' : '') + background;

	const resultingLayer = backgrounds[rlKey];

	const boundingBoxChangedHandler = (incomingBoundingBox) => {
		let boundingBox = incomingBoundingBox;
		if (boundingBox === undefined) {
			boundingBox = refRoutedMap.current.getBoundingBox();
		}
		const z = urlSearchParams.get('zoom');
		if (zoom !== z) {
			dispatch(setZoom(z));
		}
		dispatch(loadObjects({ boundingBox, inFocusMode, zoom: z }));
	};
	let symbolColor;
	if (background === 'nightplan') {
		symbolColor = '#ffffff';
	} else {
		symbolColor = '#000000';
	}

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
			locateControlEnabled={true}
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
			<BelisFeatureCollection featureCollection={featureCollection} fgColor={symbolColor} />
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
