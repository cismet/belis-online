import React from "react";
import { getVCard } from "../../core/helper/featureHelper";
import ListGroup from "react-bootstrap/ListGroup";
import { setSelectedFeature, getSelectedFeature } from "../../core/store/slices/featureCollection";
import { useDispatch, useSelector } from "react-redux";

//---------

const SideBarListElement = ({ feature, selected }) => {
  const dispatch = useDispatch();
  // const selectedFeature = useSelector(getSelectedFeature);
  let vcard = getVCard(feature);
  const style = selected ? { background: "lightgray" } : {};
  const debugColors = true;
  const oneRowEllipse = (
    <span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexBasis: "0%",
            flexGrow: "1",
            background: debugColors ? "red" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ textAlign: "left" }}>
            <b>{vcard.list.main}</b>
          </p>
        </span>
        <span
          style={{
            flexBasis: "90%",
            flexGrow: "1",
            textAlign: "right",
            background: debugColors ? "green" : undefined,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {vcard.list.upperright}
        </span>
      </div>
      <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
        <span
          style={{
            clear: "left",
            display: "block",
            background: debugColors ? "yellow" : undefined,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {vcard.list.subtitle}
        </span>
        <span style={{ float: "right", background: debugColors ? "blue" : undefined }}>
          {vcard.list.lowerright}
        </span>
      </div>
    </span>
  );
  const lineBreak = (
    <span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexBasis: "0%",
            flexGrow: "1",
            background: debugColors ? "red" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ textAlign: "left" }}>
            <b>{vcard.list.main}</b>
          </p>
        </span>
        <span
          style={{
            flexBasis: "90%",
            flexGrow: "1",
            textAlign: "right",
            background: debugColors ? "green" : undefined,
          }}
        >
          {vcard.list.upperright}
        </span>
      </div>
      <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
        <span
          style={{
            float: "left",
            display: "block",
            background: debugColors ? "yellow" : undefined,
          }}
        >
          {vcard.list.subtitle}
        </span>
        <span style={{ clear: "right", float: "right", background: debugColors ? "blue" : undefined }}>
          {vcard.list.lowerright}
        </span>
      </div>
    </span>
  );
  const lineBreak2 = (
    <span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexBasis: "0%",
            flexGrow: "1",
            background: debugColors ? "red" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ textAlign: "left" }}>
            <b>{vcard.list.main}</b>
          </p>
        </span>
        <span
          style={{
            flexBasis: "90%",
            flexGrow: "1",
            textAlign: "right",
            background: debugColors ? "green" : undefined,
          }}
        >
          {vcard.list.upperright}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexBasis: "0%",
            flexGrow: "1",
            background: debugColors ? "yellow" : undefined,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <p style={{ textAlign: "left" }}>
            {vcard.list.subtitle}
          </p>
        </span>
        {vcard.list.lowerright &&
        <span
          style={{
            flexBasis: "90%",
            flexGrow: "1",
            textAlign: "right",
            background: debugColors ? "blue" : undefined,
          }}
        >
          {vcard.list.lowerright}
        </span>}
      </div>

      {/* <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
        <span
          style={{
            float: "left",
            display: "block",
            background: debugColors ? "yellow" : undefined,
          }}
        >
          {vcard.list.subtitle}
        </span>
        <span style={{ clear: "right", float: "right", background: debugColors ? "blue" : undefined }}>
          {vcard.list.lowerright}
        </span>
      </div> */}
    </span>
  );
  const marquee = (
    <span>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap",
          gap: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            flexBasis: "0%",
            flexGrow: "1",
            background: debugColors ? "red" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          <p style={{ textAlign: "left" }}>
            <b>{vcard.list.main}</b>
          </p>
        </span>
        {/* <span style={{ flexBasis: "90%", flexGrow: "1" , textAlign: "right", background: "green", margin: "0 auto", whiteSpace: "nowrap", overflow: "hidden", boxSizing: "border-box"  }}>
                          <span style={{display: "inline-block", paddingLeft: "100%", animation: "marquee 15s linear infinite", webkitAnimation: "marquee 15s linear infinite"}}>{vcard.list.upperright}</span> */}
        <span
          class={
            vcard.list.upperright &&
            vcard.list.main &&
            vcard.list.upperright.length > 27 - vcard.list.main.length
              ? "marquee"
              : ""
          }
          style={{
            flexBasis: "90%",
            flexGrow: "1",
            textAlign: "right",
            background: "green",
            margin: "0 auto",
            whiteSpace: "nowrap",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <span>{vcard.list.upperright}</span>
        </span>
      </div>
      <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
        <span
          style={{
            float: "left",
            display: "block",
            background: debugColors ? "yellow" : undefined,
          }}
        >
          {vcard.list.subtitle}
        </span>
        <span style={{ float: "right", background: debugColors ? "blue" : undefined }}>
          {vcard.list.lowerright}
        </span>
      </div>
    </span>
  );

  return (
    <>
      <ListGroup.Item
        style={style}
        onClick={() => {
          dispatch(setSelectedFeature(feature));
        }}
      >
        {!selected && oneRowEllipse}
        {/* {selected && lineBreak} */}
        {selected && lineBreak2}
        {/* {marquee} */}

        {/* <div style={{ position: "relative", bottom: "0px", textAlign: "left" }}>
          {vcard.list.subtitle}
        </div> */}
      </ListGroup.Item>
    </>
  );
};
export default SideBarListElement;
