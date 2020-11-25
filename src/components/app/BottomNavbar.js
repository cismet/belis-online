import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ProgressBar from 'react-bootstrap/ProgressBar';

import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

import Switch from '../commons/Switch';

//---------

const BottomNavbar = ({
	background,
	onlineStatus,
	inFocusMode,
	setFocusModeActive,
	showObjects,
	refRoutedMap,
	inPaleMode,
	setPaleModeActive,
	setBackground
}) => {
	return (
		<Navbar bg={background === 'nightplan' ? 'dark' : 'light'} expand='lg'>
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
};
export default BottomNavbar;
