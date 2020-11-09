import React, { useRef, useState } from 'react';
//--------- Hooks
import useComponentSize from '@rehooks/component-size';
import { useWindowSize } from '@react-hook/window-size';
import useOnlineStatus from '@rehooks/online-status';

//--------- Bootstrap
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';

////--------- Icons
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
	faBookOpen,
	faSearch,
	faGlobeEurope,
	faBars,
	faTimes
} from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';

////--------- other cismet components
import { RoutedMap, MappingConstants } from 'react-cismap';

////--------- other 3rd party components
import bboxPolygon from '@turf/bbox-polygon';

//--------- my components
import Switch from '../components/commons/Switch';

//---------
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

const View = () => {
	const urlSearchParams = new URLSearchParams('');
	const [ width, height ] = useWindowSize();
	const onlineStatus = useOnlineStatus();

	const [ background, setBackground ] = useState('stadtplan');
	let refUpperToolbar = useRef(null);
	let sizeU = useComponentSize(refUpperToolbar);
	let lowerToolbar = useRef(null);
	let sizeL = useComponentSize(lowerToolbar);
	const mapStyle = {
		height: height - sizeU.height - sizeL.height,
		cursor: 'pointer',
		clear: 'both'
	};
	const [ focus, setFocus ] = useState(false);
	const [ pale, setPale ] = useState(false);

	const topNavbar = (
		<Navbar
			ref={refUpperToolbar}
			bg={background === 'nightplan' ? 'dark' : 'light'}
			expand='lg'
		>
			<Nav className='mr-auto'>
				<Nav.Link href='#home'>
					<Icon className='text-primary' icon={faSearch} />
				</Nav.Link>
				<NavDropdown className='text-primary' title='Suche nach' id='basic-nav-dropdown'>
					<NavDropdown.Item>Action</NavDropdown.Item>
					<NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
					<NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
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
			<Button variant='outline-primary'>
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
					disabled={true}
					id='focus-toggle'
					preLabel='Fokus'
					switched={focus}
					stateChanged={(switched) => setFocus(switched)}
				/>

				<div style={{ width: 30 }} />
				<Switch
					id='pale-toggle'
					preLabel='Blass'
					switched={pale}
					stateChanged={(switched) => setPale(switched)}
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
		</Navbar>
	);
	const resultingLayer = backgrounds[(pale === true ? 'pale_' : '') + background];
	// console.log('resultingLayer index', (pale === true ? 'pale_' : '') + background);
	// console.log('resultingLayer', resultingLayer);

	const map = (
		<RoutedMap
			editable={false}
			style={mapStyle}
			key={'leafletRoutedMap.' + pale + '.' + focus + '.' + background}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			ref={(leafletMap) => {
				// this.leafletRoutedMap = leafletMap;
			}}
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
				console.log('location', location);
			}}
			boundingBoxChangedHandler={(bb) => {
				console.log('location boundingbox', bb);
				let geom = bboxPolygon([ bb.left, bb.top, bb.right, bb.bottom ]).geometry;
				geom.srs = 25832;
				console.log(
					'location boundingbox',
					JSON.stringify({
						polygon: geom
					})
				);
			}}
		/>
	);
	return (
		<div>
			{topNavbar}
			{map}
			{bottomnNavbar}
		</div>
	);
};

export default View;
