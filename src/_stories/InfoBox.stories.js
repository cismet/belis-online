import React, { useState, useRef, useEffect } from "react";
import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import GenericInfoBoxFromFeature from "react-cismap/topicmaps/GenericInfoBoxFromFeature";
import NewWindowControl from "react-cismap/NewWindowControl";
import ContactButton from "react-cismap/ContactButton";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import FeatureCollection from "react-cismap/FeatureCollection";
import { storiesCategory, parkscheinautomatenfeatures } from "./StoriesConf";

export default {
  title: storiesCategory + "InfoBoxes",
};
const mapStyle = {
  height: window.innerHeight - 100,
  cursor: "pointer",
  clear: "both",
};

export const SimpleTopicMapWithDefaultInfoBox = (args) => {
  return (
    <TopicMapContextProvider items={parkscheinautomatenfeatures} appKey="SimpleTopicMapWithDefaultInfoBox">
      <TopicMapComponent
        style={mapStyle}
        infoBox={<GenericInfoBoxFromFeature pixelwidth={400} />}
        fullScreenControl={args.FullScreen}
        locatorControl={args.LocateControl}
      >
        {args.NewWindowControl && <NewWindowControl />}
        {args.ContactButton && (
          <ContactButton
            title='Cooltip ;-)'
            action={() => {
              window.alert("contact button pushed");
            }}
          />
        )}

        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

SimpleTopicMapWithDefaultInfoBox.args = {
  FullScreen: false,
  LocateControl: false,
  NewWindowControl: false,
  ContactButton: false,
};

export const SimpleInfoBox = () => (
  <div>
    <h1>Coming Soon</h1>
  </div>
);
export const SimpleInfoBox2 = () => <h3>Coming Soon</h3>;
