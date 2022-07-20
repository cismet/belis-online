import React from "react";
import { FeatureCollectionDisplay } from "react-cismap";

const DebugFeature = ({ feature }) => {
  return (
    <FeatureCollectionDisplay
      featureCollection={[feature]}
      clusteringEnabled={false}
      style={(feature) => {
        return {
          radius: 8,
          fillColor: "#000000",
          color: "#000000",
          opacity: 0.8,
          fillOpacity: 0.1,
        };
      }}
      //mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
      showMarkerCollection={false}
    />
  );
};

export default DebugFeature;
