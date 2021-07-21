import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useDispatch, useSelector } from 'react-redux';
import SideBarListElement from '../components/commons/SideBarListElement'
import ListGroup from 'react-bootstrap/ListGroup';
import {
	setFilter,
	loadObjects,
	isDone as featureCollectionIsDone,
	getFilter,
	getFeatureCollection,
	isSearchForbidden,
    getSelectedFeature
} from '../core/store/slices/featureCollection';

//---------

const featureTypeToName = {};
featureTypeToName['tdta_leuchten'] = 'Leuchten';
featureTypeToName['schaltstelle'] = 'Schaltstellen';
featureTypeToName['mauerlasche'] = 'Mauerlaschen';
featureTypeToName['abzweigdose'] = 'Abzweigdosen';
featureTypeToName['Leitung'] = 'Leitungen';
featureTypeToName['tdta_standort_mast'] = 'Masten';


const compareFeature = (a, b) => {
    if (a.featuretype < b.featuretype) {
        return 1;
    } else if (a.featuretype > b.featuretype) {
        return -1;
    } else {
        return 0;
    }
  };
  
const featuresEqual = (a, b) => {
    if (a && b) {
        if (a.featuretype == b.featuretype) {
            return a.properties.id === b.properties.id;
        }
    }

    return false;
  };

const SideBar = ({ innerRef, refRoutedMap, setCacheSettingsVisible, height }) => {
	// const dispatch = useDispatch();
	// const browserlocation = useLocation();
    const selectedFeature = useSelector(getSelectedFeature);
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
//                alert('selected: ' + getSelectedFeature());
                if (currentFeatureType === null || currentFeatureType !== value.featuretype) {
                    currentFeatureType = value.featuretype;

                    return (
                        <div>
                            <ListGroup.Item style={{textAlign: 'left', padding: '0px 0px 0px 10px', background: '#f8f9fa'}}>
                                <b>{(featureTypeToName[currentFeatureType] === undefined ? currentFeatureType : featureTypeToName[currentFeatureType]) + ' ' + typeCount[currentFeatureType]}</b>
                            </ListGroup.Item>
                            <SideBarListElement feature={value} selected={featuresEqual(selectedFeature, value)}></SideBarListElement>
                        </div>
                    );
                } else {
                    return (
                        <SideBarListElement feature={value} selected={featuresEqual(selectedFeature, value)}></SideBarListElement>
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
