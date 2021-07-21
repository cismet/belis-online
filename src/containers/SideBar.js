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
import { getCacheInfo, getCacheSettings } from '../core/store/slices/cacheControl';
import { isPaleModeActive, setPaleModeActive } from '../core/store/slices/paleMode';
import SideBarListElement from '../components/commons/SideBarListElement'
import ListGroup from 'react-bootstrap/ListGroup';
import {
	setFilter,
	loadObjects,
	isDone as featureCollectionIsDone,
	getFilter,
	getFeatureCollection,
	isSearchForbidden
} from '../core/store/slices/featureCollection';

//---------

const compareFeature = (a, b) => {
    if (a.featuretype < b.featuretype) {
        return 1;
    } else if (a.featuretype > b.featuretype) {
        return -1;
    } else {
        return 0;
    }
  };
  

const SideBar = ({ innerRef, refRoutedMap, setCacheSettingsVisible, height }) => {
	// const dispatch = useDispatch();
	// const browserlocation = useLocation();
	const featureCollection = useSelector(getFeatureCollection);
	const mapStyle = {
        width: '250px',
		height,
        overflowY: 'auto'
	};
    console.log('xxx' + featureCollection);
    const sortedElements = [];
    const typeCount = {};

    for (const el of featureCollection) {
        if (typeCount[el.featuretype] === undefined) {
            typeCount[el.featuretype] = 1;
        } else {
            typeCount[el.featuretype] = typeCount[el.featuretype] + 1;
        }
        sortedElements.push(el);
    }

//    Array.prototype.push.apply(sortedElements, featureCollection);
    sortedElements.sort(compareFeature);
    let currentFeatureType = null;

	return (
        <>
            {/* <Nav className="col-md-12 d-none d-md-block bg-light sidebar" */}
            <Nav className="d-md-block bg-light sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
            <div style={mapStyle}>
            <ListGroup>
            {sortedElements.map((value, index) => {
                if (currentFeatureType === null || currentFeatureType !== value.featuretype) {
                    currentFeatureType = value.featuretype;

                    return (
                        <div>
                            <ListGroup.Item>{currentFeatureType + ' ' + typeCount[currentFeatureType]}</ListGroup.Item>
                            <SideBarListElement feature={value}></SideBarListElement>
                        </div>
                    );
                } else {
                    return (
                        <SideBarListElement feature={value}></SideBarListElement>
                    );
                }
            })}
            </ListGroup>
            </div>
            </Nav>
        </>
	);
};
export default SideBar;
