import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { faBars, faBookOpen, faGlobeEurope, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';

import Switch from '../commons/Switch';

import { setFilter } from '../../core/store/slices/mapping';

//---------

const TopNavbar = ({
	innerRef,
	background,
	fcIsDone,
	inSearchMode,
	featureCollection,
	searchForbidden,
	setSearchModeActive,
	setSearchModeWish,
	showObjects,
	refRoutedMap,
	inFocusMode,
	filterState,
	dispatch,
	setCacheSettingsVisible
}) => {
	return (
		<Navbar
			ref={innerRef}
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
						disabled={searchForbidden}
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
};

export default TopNavbar;
