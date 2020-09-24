import React, { useRef, useState } from 'react';
//--------- Hooks
import useComponentSize from '@rehooks/component-size';
import { useWindowSize } from '@react-hook/window-size';

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

////--------- other components
import { RoutedMap, MappingConstants } from 'react-cismap';
import useOnlineStatus from '@rehooks/online-status';

//--------- my components
import Switch from '../components/commons/Switch';

//---------
const backgrounds = {
	stadtplan: 'wupp-plan-live@90',
	lbk: 'wupp-plan-live@100|trueOrtho2020@75|rvrSchrift@100',
	nightplan:
		'wupp-plan-live@{"opacity":0.9,"css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"}'
};
const View = () => {
	const urlSearchParams = new URLSearchParams('');
	const [ width, height ] = useWindowSize();
	const onlineStatus = useOnlineStatus();
	const [ backgroundLayer, setBackgroundLayer ] = useState(backgrounds.stadtplan);
	let refUpperToolbar = useRef(null);
	let sizeU = useComponentSize(refUpperToolbar);
	let lowerToolbar = useRef(null);
	let sizeL = useComponentSize(lowerToolbar);
	const mapStyle = {
		height: height - sizeU.height - sizeL.height,
		cursor: 'pointer',
		clear: 'both'
	};

	return (
		<div>
			<Navbar
				ref={refUpperToolbar}
				bg={backgroundLayer === backgrounds.nightplan ? 'dark' : 'light'}
				expand='lg'
			>
				<Nav className='mr-auto'>
					<Nav.Link href='#home'>
						<Icon className='text-primary' icon={faSearch} />
					</Nav.Link>
					<NavDropdown
						className='text-primary'
						title='Suche nach'
						id='basic-nav-dropdown'
					>
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

				<Nav className='mr-auto text-primary'>
					Kein Arbeitsauftrag ausgewählt (Erneuerung)
				</Nav>
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

				{/* <Form inline>
					<Button variant='outline-primary'>Suche</Button>

					<FormControl
						type='text'
						placeholder='Stadtteil | Adresse | POI'
						className='mr-sm-2'
					/>
				</Form> */}
				<Button variant='outline-primary'>
					<Icon icon={faBars} />
				</Button>
			</Navbar>
			<RoutedMap
				editable={false}
				style={mapStyle}
				key={'leafletRoutedMap'}
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
				backgroundlayers={backgroundLayer || 'trueOrtho2020@100'}
				urlSearchParams={urlSearchParams}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			/>
			<Navbar
				ref={lowerToolbar}
				bg={backgroundLayer === backgrounds.nightplan ? 'dark' : 'light'}
				expand='lg'
			>
				<Navbar.Brand href='#home'>{onlineStatus ? 'Online' : 'Offline'}</Navbar.Brand>
				<Navbar.Toggle aria-controls='basic-navbar-nav' />
				<Nav className='mr-auto'>
					<Nav.Link href='#home'>
						<Icon className='text-primary' icon={faCompass} />
					</Nav.Link>
				</Nav>
				<Nav className='mr-auto'>
					<Switch id='focus-toggle' preLabel='Fokus' />
					<div style={{ width: 30 }} />
					<Switch id='pale-toggle' preLabel='Blass' />
				</Nav>

				<Form inline>
					<ButtonGroup className='mr-2' aria-label='First group'>
						<Button
							variant={
								backgroundLayer === backgrounds.stadtplan ? (
									'primary'
								) : (
									'outline-primary'
								)
							}
							onClick={() => {
								setBackgroundLayer(backgrounds.stadtplan);
							}}
						>
							Stadtplan
						</Button>
						<Button
							variant={
								backgroundLayer === backgrounds.nightplan ? (
									'primary'
								) : (
									'outline-primary'
								)
							}
							onClick={() => {
								setBackgroundLayer(backgrounds.nightplan);
							}}
						>
							Stadtplan dunkel
						</Button>
						<Button
							variant={
								backgroundLayer === backgrounds.lbk ? 'primary' : 'outline-primary'
							}
							onClick={() => {
								setBackgroundLayer(backgrounds.lbk);
							}}
						>
							Luftbildkarte
						</Button>
					</ButtonGroup>
				</Form>
			</Navbar>
		</div>
	);
};

export default View;
