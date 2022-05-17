import React from "react";
import { FeatureCollectionDisplay } from "react-cismap";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedFeature, setSelectedFeature } from "../../core/store/slices/featureCollection";
import "@fortawesome/fontawesome-free/js/all.js";
import L from "leaflet";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import { getBackground } from "../../core/store/slices/background";

const DEBUGGING = false;
const BelisFeatureCollection = ({ featureCollection, fgColor = "#000000" }) => {
  const dispatch = useDispatch();
  const selectedFeature = useSelector(getSelectedFeature);
  const background = useSelector(getBackground);
  let modeClass = "brightMode";

  // if (background === "nightplan") {
  //   modeClass = "darkMode";
  // }
  return (
    <div>
      {DEBUGGING && (
        <FeatureCollectionDisplay
          key={"FCD.selectedFeature" + selectedFeature?.id}
          featureCollection={featureCollection}
          clusteringEnabled={false}
          style={(feature) => {
            return {
              radius: 5,
              fillColor: "red",
              color: "blue",
              opacity: 1,
              fillOpacity: 0.8,
            };
          }}
          showMarkerCollection={false}
        />
      )}
      <FeatureCollectionDisplay
        key={"FCD.selectedFeature" + selectedFeature?.id}
        featureCollection={featureCollection}
        featureClickHandler={(event, feature) => {
          setTimeout(() => {
            dispatch(setSelectedFeature(feature));
          }, 10);
        }}
        clusteringEnabled={false}
        style={(feature) => {
          let customMarker;
          if (feature.featuretype !== "leitung") {
            let divContent = `<div   class="${modeClass} belisiconclass_${feature.featuretype}">
                                <div class="${modeClass} belisiconclass_${feature.featuretype}_inner"></div>
                              </div>`;
            if (feature.selected === true) {
              divContent = `<div class="${modeClass} selectedfeature">${divContent}</div>`;
            }
            customMarker = L.divIcon({
              className: "belis-custom-marker",
              html: divContent,
              iconAnchor: [14, 14],
              iconSize: [28, 28],
            });
          }
          return {
            radius: 14,
            fillColor: "red",
            color: feature.selected === true ? "#7AA8F6" : "#D3976C",
            opacity: 1,
            weight: 4,
            fillOpacity: 0.8,

            customMarker,
          };
        }}
        //mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
        showMarkerCollection={false}
      />
    </div>
  );
};
export default BelisFeatureCollection;
