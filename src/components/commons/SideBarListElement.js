import React from 'react';
import { getVCard } from '../../core/helper/FeatureHelper';
import ListGroup from 'react-bootstrap/ListGroup';

//---------

const SideBarListElement = ({ feature, selected }) => {
	// const dispatch = useDispatch();
	// const browserlocation = useLocation();

	// const inFocusMode = useSelector(isInFocusMode);
	// const inPaleMode = useSelector(isPaleModeActive);
	// const background = useSelector(getBackground);
	// const cacheInfo = useSelector(getCacheInfo('abzweigdose'));
	// const cacheSettings = useSelector(getCacheSettings);
	// const connectionMode = useSelector(getConnectionMode);
	// const uiThreadProgressbar =
	// 	new URLSearchParams(browserlocation.search).get('uiThreadProgressbar') === 'true';
    // console.log(feature.featuretype);
    let vcard = getVCard(feature);
    const style = (selected ? {background: 'lightgray'} : {});

	return (
        <>
            <ListGroup.Item style={style}>
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
