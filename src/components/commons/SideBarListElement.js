import React from 'react';
import { getVCard } from '../../core/helper/FeatureHelper';
import ListGroup from 'react-bootstrap/ListGroup';
import {
    setSelectedFeature,
    getSelectedFeature,
    setSelectedFeatureVis,
} from '../../core/store/slices/featureCollection';
import { useDispatch, useSelector } from 'react-redux';

//---------

const SideBarListElement = ({ feature, selected }) => {
    const dispatch = useDispatch();
    const selectedFeature = useSelector(getSelectedFeature);
    let vcard = getVCard(feature);
    const style = (selected ? {background: 'lightgray'} : {});

	return (
        <>
            <ListGroup.Item style={style} onClick={() => {
                if (selectedFeature !== feature.feature) {
                    dispatch(setSelectedFeature(feature.feature));
                    dispatch(setSelectedFeatureVis(feature));
                } else {
                    dispatch(setSelectedFeature(undefined));
                    dispatch(setSelectedFeatureVis(undefined));
                }
            }} >
            <div>
                <span style={{float:'left'}}><b>{vcard.title}</b></span>
                <span style={{float:'right'}}>{vcard.location}</span>
            </div>
            <br />
            <div style={{position: 'relative', bottom: '0px', textAlign: 'left'}}>{vcard.subtitle}</div>
            {/* <Nav.Link href="/home">Active</Nav.Link>s */}
            </ListGroup.Item>
        </>
	);
};
export default SideBarListElement;
