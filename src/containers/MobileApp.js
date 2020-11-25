import React, { useRef, useState, useEffect } from 'react';
//--------- Hooks
import useComponentSize from '@rehooks/component-size';
import { useWindowSize } from '@react-hook/window-size';
import useOnlineStatus from '@rehooks/online-status';
import { useHistory, useLocation } from 'react-router-dom';
import useLocalStorage from '../core/commons/hooks/useLocalStorage';
//--------- Redux
import { Provider, useDispatch, useSelector } from 'react-redux';

//--------- Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';

//--------- other

//--------- Icons
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
	faBookOpen,
	faSearch,
	faGlobeEurope,
	faBars,
	faTimes,
	faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';

////--------- other cismet components
import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from 'react-cismap';

////--------- other 3rd party components
import bboxPolygon from '@turf/bbox-polygon';

//--------- my components
import Switch from '../components/commons/Switch';
import { getFeatureCollection } from '../core/store/slices/featureCollection';
import {
	getBoundingBox,
	getFilter,
	isDone,
	setBoundingBox,
	setBoundingBoxAndLoadObjects,
	setFilter
} from '../core/store/slices/mapping';
import { getLoadingState, initIndex } from '../core/store/slices/spatialIndex';
import { modifyQueryPart } from '../core/commons/routingHelper';
import CacheSettings from '../components/CacheSettings';
//---------

//---
const backgrounds = {
	stadtplan: 'wupp-plan-live@90',
	lbk: 'wupp-plan-live@100|trueOrtho2020@75|rvrSchrift@100',
	nightplan:
		'wupp-plan-live@{"opacity":0.9,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}',
	pale_stadtplan: 'wupp-plan-live@30',
	pale_lbk: 'wupp-plan-live@20|trueOrtho2020@30|rvrSchrift@100',
	pale_nightplan:
		'wupp-plan-live@{"opacity":0.3,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}'
};

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
	let lowerToolbar = useRef(null);
	let sizeL = useComponentSize(lowerToolbar);
	const mapStyle = {
		height: windowHeight - (sizeU.height || 56) - (sizeL.height || 56),
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
	const [ fc, setFC ] = useState([]);
	// const [ filterState, setFilterState ] = useLocalStorage('@belis.app.filterState', );

	const [ cacheSettingsVisible, setCacheSettingsVisible ] = useState(false);
	const [ focusBoundingBox, setFocusBoundingBox ] = useState(undefined);
	const [ fcIsDone, setFCIsDone ] = useState(true);
	const fcIsDoneRef = useRef(null);
	const [ mapBlockerVisible, setMapBlockerVisible ] = useState(false);

	// vars from redux state
	const featureCollection = fc; //useSelector(getFeatureCollection);
	const boundingBox = useSelector(getBoundingBox);
	// const fcIsDone = useSelector(isDone);

	const loadingState = useSelector(getLoadingState);
	const filterState = useSelector(getFilter);

	useEffect(
		() => {
			fcIsDoneRef.current = fcIsDone;
			console.log('fcIsDone', fcIsDone);

			if (fcIsDone === true) {
				setMapBlockerVisible(false);
			} else {
				setTimeout(() => {
					setMapBlockerVisible(fcIsDoneRef.current === false);
					console.log('setMapBlockerVisible', fcIsDoneRef.current === false);
				}, 250);
			}
		},
		[ fcIsDone ]
	);

	const searchForbidden = (overrides = {}) => {
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

	const topNavbar = (
		<Navbar
			ref={refUpperToolbar}
			bg={background === 'nightplan' ? 'dark' : 'light'}
			expand='lg'
			key={'navbar.' + fcIsDone}
		>
			<Nav className='mr-auto'>
				<Nav.Link>
					<div
						// onClick={() => {
						// 	window.location.reload();
						// }}
						style={{ width: 20 }}
						key={'navbar.div.' + fcIsDone}
					>
						{fcIsDone === false &&
						inSearchMode === true && (
							// <Icon className='text-primary' spin icon={faSpinner} />
							<span>-.-</span>
						)}
						{fcIsDone === true && (
							<div style={{ fontSize: 9, marginTop: 7 }}>
								{featureCollection.length}
							</div>
						)}
					</div>
				</Nav.Link>
				<Nav.Link>
					<Switch
						disabled={searchForbidden()}
						id='search-mode-toggle'
						key={'search-mode-toggle' + inSearchMode}
						preLabel='Suche'
						switched={inSearchMode}
						stateChanged={(switched) => {
							setSearchModeActive(switched);
							if (switched === true) {
								setSearchModeWish(true);
								showObjects(refRoutedMap.current.getBoundingBox(), inFocusMode);
							} else {
								setSearchModeWish(false);
							}
						}}
					/>
				</Nav.Link>
				<NavDropdown
					className='text-primary'
					title='nach'
					id='basic-nav-dropdown'
					rootCloseEvent='jj'
				>
					{Object.keys(filterState).map((key) => {
						const item = filterState[key];
						return (
							<NavDropdown.Item style={{ width: 300 }}>
								<Switch
									id={item.key + 'toggle-id'}
									key={item.key + 'toggle'}
									preLabel={item.title}
									switched={item.enabled}
									toggleStyle={{ float: 'right' }}
									stateChanged={(switched) => {
										const _fs = JSON.parse(JSON.stringify(filterState));
										_fs[key].enabled = switched;
										dispatch(setFilter(_fs));
										setTimeout(() => {
											showObjects(
												refRoutedMap.current.getBoundingBox(),
												inFocusMode
											);
										}, 50);
									}}
								/>
							</NavDropdown.Item>
						);
					})}
				</NavDropdown>
				<Nav.Link href='#home'>
					<Icon className='text-primary' icon={faGlobeEurope} />
				</Nav.Link>
			</Nav>

			<Nav className='mr-auto text-primary'>Kein Arbeitsauftrag ausgewählt (Erneuerung)</Nav>
			<Nav.Link href='#home'>
				<Icon icon={faBookOpen} />
			</Nav.Link>
			<Form inline style={{ marginRight: 10 }}>
				<InputGroup style={{ width: 240 }}>
					<InputGroup.Prepend>
						<InputGroup.Text id='basic-addon1'>
							<Icon icon={faTimes} />
						</InputGroup.Text>
					</InputGroup.Prepend>
					<FormControl
						placeholder='Stadtteil | Adresse | POI'
						aria-label='Username'
						aria-describedby='basic-addon1'
					/>
				</InputGroup>
			</Form>
			<Button
				onClick={() => {
					setCacheSettingsVisible(true);
				}}
				variant='outline-primary'
			>
				<Icon icon={faBars} />
			</Button>
		</Navbar>
	);
	const bottomnNavbar = (
		<Navbar ref={lowerToolbar} bg={background === 'nightplan' ? 'dark' : 'light'} expand='lg'>
			<Navbar.Brand href='#home'>{onlineStatus ? 'Online' : 'Offline'}</Navbar.Brand>

			<Navbar.Toggle aria-controls='basic-navbar-nav' />
			<Nav className='mr-auto'>
				<Nav.Link href='#home'>
					<Icon className='text-primary' icon={faCompass} />
				</Nav.Link>
			</Nav>
			<Nav className='mr-auto'>
				<Switch
					disabled={false}
					id='focus-toggle'
					preLabel='Fokus'
					switched={inFocusMode}
					stateChanged={(switched) => {
						setFocusModeActive(switched);

						showObjects(refRoutedMap.current.getBoundingBox(), switched);
					}}
				/>

				<div style={{ width: 30 }} />
				<Switch
					id='pale-toggle'
					preLabel='Blass'
					switched={inPaleMode}
					stateChanged={(switched) => setPaleModeActive(switched)}
				/>
			</Nav>

			<Form inline>
				<ButtonGroup className='mr-2' aria-label='First group'>
					<Button
						variant={background === 'stadtplan' ? 'primary' : 'outline-primary'}
						onClick={() => {
							setBackground('stadtplan');
						}}
					>
						Stadtplan
					</Button>
					<Button
						variant={background === 'nightplan' ? 'primary' : 'outline-primary'}
						onClick={() => {
							setBackground('nightplan');
						}}
					>
						Stadtplan dunkel
					</Button>
					<Button
						variant={background === 'lbk' ? 'primary' : 'outline-primary'}
						onClick={() => {
							setBackground('lbk');
						}}
					>
						Luftbildkarte
					</Button>
				</ButtonGroup>
			</Form>
			<Nav>
				<ProgressBar style={{ width: 200 }} animated now={100} max={100} />
			</Nav>
		</Navbar>
	);
	const resultingLayer = backgrounds[(inPaleMode === true ? 'pale_' : '') + background];
	// console.log('resultingLayer index', (pale === true ? 'pale_' : '') + background);
	// console.log('resultingLayer', resultingLayer);

	const boundingBoxChangedHandler = (incomingBoundingBox) => {
		let bb = incomingBoundingBox;
		if (bb === undefined) {
			bb = refRoutedMap.current.getBoundingBox();
		}

		const _searchForbidden = searchForbidden();
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
		//console.log('xxx zoom', zoom);

		if (zoom === -1) {
			// //console.log('xxx try again #', retried);
			if (retried < 5) {
				setTimeout(() => {
					showObjects(bb, inFocusMode, retried + 1);
				}, 10);
				return;
			}
		}

		const _searchForbidden = searchForbidden({ inFocusMode });

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

			dispatch(setBoundingBoxAndLoadObjects(xbb, setFC, setFCIsDone));
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
			refX={(leafletMap) => {
				console.log('leafletMap', leafletMap);

				// this.leafletRoutedMap = leafletMap;
			}}
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
			{/* <FeatureCollectionDisplay
				featureCollection={featureCollection}
				clusteringEnabled={false}
				style={(feature) => {
					return {
						radius: 8,
						fillColor: 'red',
						color: 'green',
						opacity: 1,
						fillOpacity: 0.8
					};
				}}
				showMarkerCollection={false}
			/> */}
			<FeatureCollectionDisplay
				featureCollection={featureCollection}
				clusteringEnabled={false}
				style={(feature) => {
					const svgs = {
						tdta_leuchten: {
							svg: `
							<svg width="12px" height="12px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
								<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									<g id="ic-adjust-24px" transform="translate(-2.000000, -2.000000)">
										<path d="M12,2 C6.49,2 2,6.49 2,12 C2,17.51 6.49,22 12,22 C17.51,22 22,17.51 22,12 C22,6.49 17.51,2 12,2 Z M12,20 C7.59,20 4,16.41 4,12 C4,7.59 7.59,4 12,4 C16.41,4 20,7.59 20,12 C20,16.41 16.41,20 12,20 Z M15,12 C15,13.66 13.66,15 12,15 C10.34,15 9,13.66 9,12 C9,10.34 10.34,9 12,9 C13.66,9 15,10.34 15,12 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>
										<polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
									</g>
								</g>
							</svg>`,
							size: 20
						},
						tdta_standort_mast: {
							svg: `
							<svg width="12px" height="12px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
								<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									<path d="M12,2 C6.49,2 2,6.49 2,12 C2,17.51 6.49,22 12,22 C17.51,22 22,17.51 22,12 C22,6.49 17.51,2 12,2 Z M12,19 C8.14125,19 5,15.85875 5,12 C5,8.14125 8.14125,5 12,5 C15.85875,5 19,8.14125 19,12 C19,15.85875 15.85875,19 12,19 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>
									<polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
								</g>
							</svg>`,
							size: 20
						},
						schaltstelle: {
							svg: `
							<svg width="12px" height="12px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
								<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
									<path d="M38,6 L10,6 C7.79,6 6,7.79 6,10 L6,38 C6,40.21 7.79,42 10,42 L38,42 C40.21,42 42,40.21 42,38 L42,10 C42,7.79 40.21,6 38,6 Z M28,14 L34,14 L34,34 L28,34 L28,14 Z M14,14 L20,14 L20,34 L14,34 L14,14 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>
									<polygon id="Path" points="0 0 48 0 48 48 0 48"></polygon>
								</g>
							</svg>`,
							size: 20
						},
						abzweigdose: {
							svg: `
							<svg width="16px" height="12px" viewBox="0 0 36 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="ic-check-box-outline-blank-24px" transform="translate(6.000000, -3.000000)">
									<path d="M19,5 L19,19 L5,19 L5,5 L19,5 L19,5 Z M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>
									<polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
								</g>
								<path d="M9,9 L1,9" id="Line" stroke="#000000" stroke-linecap="square"></path>
								<path d="M18,25 L18,17" id="Line" stroke="#000000" stroke-linecap="square"></path>
								<path d="M35,9 L27,9" id="Line" stroke="#000000" stroke-linecap="square"></path>
							</g>
							</svg>`,
							size: 20
						},
						mauerlasche: {
							svg: `<svg width="7px" height="7px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="ic-check-box-outline-blank-24px" transform="translate(-3.000000, -3.000000)">
									<path d="M19,5 L19,19 L5,19 L5,5 L19,5 L19,5 Z M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z" id="Shape" fill="#000000" fill-rule="nonzero"></path>
									<polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
								</g>
							</g>
							</svg>`,
							size: 20
						}
					};

					return {
						radius: 8,
						fillColor: 'red',
						color: '#D3976C',
						opacity: 1,
						fillOpacity: 0.8,
						svg: (svgs[feature.featuretype] || {}).svg,
						svgSize: (svgs[feature.featuretype] || {}).size
					};
				}}
				//mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
				showMarkerCollection={false}
			/>

			{false &&
			focusBoundingBox !== undefined &&
			inFocusMode === true && (
				<FeatureCollectionDisplay
					featureCollection={[ focusBoundingBox ]}
					clusteringEnabled={false}
					style={(feature) => {
						console.log('featurestyle ', feature);

						return {
							radius: 8,
							fillColor: '#000000',
							color: '#000000',
							opacity: 0.8,
							fillOpacity: 0.1
						};
					}}
					//mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
					showMarkerCollection={false}
				/>
			)}
			{inFocusMode === true && (
				<div
					style={{
						position: 'absolute',
						top: mapStyle.height / 4,
						left: mapStyle.width / 4,
						zIndex: 500,
						width: mapStyle.width / 2,
						height: mapStyle.height / 2,
						opacity: 0.1,
						background: '#000000',
						mrgin: 10
					}}
				/>
			)}
		</RoutedMap>
	);
	// console.log('yyy fcIsDone', fcIsDone);
	console.log('mapBlockerVisible', mapBlockerVisible);

	return (
		<div>
			{cacheSettingsVisible === true && (
				<CacheSettings
					hide={() => {
						setCacheSettingsVisible(false);
					}}
				/>
			)}
			{topNavbar}
			{fcIsDone === false && (
				<div
					style={{
						position: 'absolute',
						height: windowHeight,
						width: windowWidth,
						background: 'black',
						left: 0,
						top: 0,
						zIndex: 100000,
						cursor: 'wait',
						opacity: mapBlockerVisible === true ? 0.2 : 0
					}}
				/>
			)}
			{map}
			{bottomnNavbar}
		</div>
	);
};

export default View;
