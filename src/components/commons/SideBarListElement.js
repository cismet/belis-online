import React from "react";
import { getVCard } from "../../core/helper/featureHelper";
import ListGroup from "react-bootstrap/ListGroup";
import { setSelectedFeature, getSelectedFeature } from "../../core/store/slices/featureCollection";
import { useDispatch, useSelector } from "react-redux";

//---------

const SideBarListElement = ({ feature, selected }) => {
  const dispatch = useDispatch();
  const selectedFeature = useSelector(getSelectedFeature);
  let vcard = getVCard(feature);
  const style = selected ? { background: "lightgray" } : {};

  return (
    <>
      <ListGroup.Item
        style={style}
        onClick={() => {
          if (selectedFeature !== feature) {
            dispatch(setSelectedFeature(feature));
          } else {
            dispatch(setSelectedFeature(undefined));
          }
        }}
      >
        <div>
          <span style={{ float: "left" }}>
            <b>{vcard.list.main}</b>
          </span>
          <span style={{ float: "right" }}>{vcard.list.upperright}</span>
        </div>
        <br />
        <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
          &nbsp;
          <span style={{ float: "left" }}>{vcard.list.subtitle}</span>
          <span style={{ float: "right" }}>{vcard.list.lowerright}</span>
        </div>

        {/* <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
          {vcard.list.subtitle}
        </div> */}
      </ListGroup.Item>
    </>
  );
};
export default SideBarListElement;
