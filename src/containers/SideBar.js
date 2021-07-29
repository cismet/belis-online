import {React, useState, useEffect} from 'react';
import Nav from 'react-bootstrap/Nav';
import { useDispatch, useSelector } from 'react-redux';
import SideBarListElement from '../components/commons/SideBarListElement'
import ListGroup from 'react-bootstrap/ListGroup';
import {
	getFeatureCollection,
    getSelectedFeature,
    setSortedItems,
} from '../core/store/slices/featureCollection';
import { convertFeatureToItem } from '../core/helper/FeatureHelper';

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
        return a.compare(a, b);
    }
  };
  
const featuresEqual = (a, b) => {
    if (a && b) {
        if (a.featuretype === b.featuretype) {
            return a.properties.id === b.properties.id;
        }
    }

    return false;
  };

const SideBar = ({ innerRef, height }) => {
    const dispatch = useDispatch();
    const [allFeatures, setAllFeatures] = useState([]);
    const [hits, setHits] = useState([]);
    const selectedFeature = useSelector(getSelectedFeature);
	const featureCollection = useSelector(getFeatureCollection);
	const mapStyle = {
        width: '300px',
		height,
        overflowY: 'auto'
	};

    if (allFeatures !== featureCollection) {
        setAllFeatures(featureCollection);
    }

    useEffect(() => {
        const tasks = [];

        for (const f of allFeatures) {
          tasks.push(convertFeatureToItem(f));
        }

        Promise.all(tasks).then(
            (results) => {
                const hi = [];
        
                for (const result of results) {
                    hi.push(result);
                }
                setHits(hi);
            },
            (problem) => {
                alert('problem');
                //todo: do something
            }
        );
    }, [allFeatures]);
    
    const sortedElements = [];
    const typeCount = {};

    for (const el of hits) {
        if (typeCount[el.featuretype] === undefined) {
            typeCount[el.featuretype] = 1;
        } else {
            typeCount[el.featuretype] = typeCount[el.featuretype] + 1;
        }
        sortedElements.push(el);
    }

    sortedElements.sort(compareFeature);
    dispatch(setSortedItems(sortedElements));
    let currentFeatureType = null;

	return (
        <>
            {/* <Nav className="col-md-12 d-none d-md-block bg-light sidebar" */}
            <Nav ref={innerRef} className="d-md-block bg-light sidebar"
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
                            <ListGroup.Item style={{textAlign: 'left', padding: '0px 0px 0px 10px', background: '#f8f9fa'}}>
                                <b>{(featureTypeToName[currentFeatureType] === undefined ? currentFeatureType : featureTypeToName[currentFeatureType]) + ' ' + typeCount[currentFeatureType]}</b>
                            </ListGroup.Item>
                            <SideBarListElement feature={value} selected={featuresEqual(selectedFeature, value?.feature)}></SideBarListElement>
                        </div>
                    );
                } else {
                    return (
                        <SideBarListElement feature={value} selected={featuresEqual(selectedFeature, value?.feature)}></SideBarListElement>
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
