import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

import Switch from '../components/commons/Switch';
import { useDispatch, useSelector } from 'react-redux';
import {
	loadObjects,
	isInFocusMode,
	setFocusModeActive
} from '../core/store/slices/featureCollection';
import { isPaleModeActive, setPaleModeActive } from '../core/store/slices/paleMode';
import { getBackground, setBackground } from '../core/store/slices/background';
import { useLocation } from 'react-router-dom';

//---------

const BottomNavbar = ({ innerRef, onlineStatus, refRoutedMap }) => {
	const dispatch = useDispatch();
	const browserlocation = useLocation();

	const inFocusMode = useSelector(isInFocusMode);
	const inPaleMode = useSelector(isPaleModeActive);
	const background = useSelector(getBackground);

	const uiThreadProgressbar =
		new URLSearchParams(browserlocation.search).get('uiThreadProgressbar') === 'true';

	return (
		<Navbar ref={innerRef} bg={background === 'nightplan' ? 'dark' : 'light'} expand='lg'>
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
						dispatch(setFocusModeActive(switched));
						dispatch(
							loadObjects({
								boundingBox: refRoutedMap.current.getBoundingBox(),
								inFocusMode: switched
							})
						);
					}}
				/>

				<div style={{ width: 30 }} />
				<Switch
					id='pale-toggle'
					preLabel='Blass'
					switched={inPaleMode}
					stateChanged={(switched) => dispatch(setPaleModeActive(switched))}
				/>
			</Nav>

			<Form inline>
				<ButtonGroup className='mr-2' aria-label='First group'>
					<Button
						variant={background === 'stadtplan' ? 'primary' : 'outline-primary'}
						onClick={() => {
							dispatch(setBackground('stadtplan'));
						}}
					>
						Stadtplan
					</Button>
					<Button
						variant={background === 'nightplan' ? 'primary' : 'outline-primary'}
						onClick={() => {
							dispatch(setBackground('nightplan'));
						}}
					>
						Stadtplan dunkel
					</Button>
					<Button
						variant={background === 'lbk' ? 'primary' : 'outline-primary'}
						onClick={() => {
							dispatch(setBackground('lbk'));
						}}
					>
						Luftbildkarte
					</Button>
				</ButtonGroup>
			</Form>
			{uiThreadProgressbar === true && (
				<Nav>
					<ProgressBar style={{ width: 200 }} animated now={100} max={100} />
				</Nav>
			)}
		</Navbar>
	);
};
export default BottomNavbar;
