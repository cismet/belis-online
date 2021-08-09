import { faMixcloud } from '@fortawesome/free-brands-svg-icons';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Switch from '../components/commons/Switch';
import { CONNECTIONMODE, getConnectionMode, setConnectionMode } from '../core/store/slices/app';
import { getBackground, setBackground } from '../core/store/slices/background';
import {
	isInFocusMode,
	loadObjects,
	setFocusModeActive
} from '../core/store/slices/featureCollection';
import { isPaleModeActive, setPaleModeActive } from '../core/store/slices/paleMode';

//---------

const BottomNavbar = ({ innerRef, onlineStatus, refRoutedMap, jwt }) => {
	const dispatch = useDispatch();
	const browserlocation = useLocation();

	const inFocusMode = useSelector(isInFocusMode);
	const inPaleMode = useSelector(isPaleModeActive);
	const background = useSelector(getBackground);
	const connectionMode = useSelector(getConnectionMode);
	const uiThreadProgressbar =
		new URLSearchParams(browserlocation.search).get('uiThreadProgressbar') === 'true';

	return (
		<Navbar ref={innerRef} bg={background === 'nightplan' ? 'dark' : 'light'} expand='lg'>
			<Navbar.Brand>{onlineStatus ? 'Online' : 'Offline'}</Navbar.Brand>

			<Navbar.Toggle aria-controls='basic-navbar-nav' />
			<Nav className='mr-auto'>
				<div>
					{connectionMode === CONNECTIONMODE.ONLINE && (
						<Icon
							style={{ fontSize: 24, width: '30px', cursor: 'pointer' }}
							className='text-primary'
							icon={faMixcloud}
							onClick={() => {
								dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
							}}
						/>
					)}
					{connectionMode === CONNECTIONMODE.FROMCACHE && (
						<Icon
							style={{ fontSize: 24, width: '30px', cursor: 'pointer' }}
							className='text-primary'
							icon={faDatabase}
							onClick={() => {
								dispatch(setConnectionMode(CONNECTIONMODE.ONLINE));
							}}
						/>
					)}
				</div>
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
								inFocusMode: switched,
								jwt: jwt
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
