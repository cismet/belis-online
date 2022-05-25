import { createSlice } from "@reduxjs/toolkit";
import { getFeatureCollection } from "./featureCollection";
import envelope from "@turf/envelope";
import { projectionData } from "react-cismap/constants/gis";
import { featureCollection } from "@turf/helpers";
import { useDispatch } from "react-redux";
import { convertBBox2Bounds } from "react-cismap/tools/mappingHelpers";

const initialState = { mapRef: undefined };

const slice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapRef(state, action) {
      state.mapRef = action.payload;
      return state;
    },
  },
});

export default slice;

export const { setMapRef } = slice.actions;

export const getMapRef = (state) => {
  return state.map.mapRef;
};

export const fitBoundsForCollection = (featuresToZoomTo) => {
  return async (dispatch, getState) => {
    const state = getState();
    const mapRef = getMapRef(state);
    const fitBBox = (bbox, refDefOfBBox) => {
      if (mapRef?.fitBounds && bbox) {
        mapRef.fitBounds(convertBBox2Bounds(bbox, refDefOfBBox));
      }
    };

    let fc = featuresToZoomTo || getFeatureCollection(state);
    if (fc.length > 0) {
      let refDef;
      //find out crs
      if (Array.isArray(fc) && fc.length > 0) {
        const firstFeature = fc[0];
        const code = firstFeature?.crs?.properties?.name?.split("EPSG::")[1];
        refDef = projectionData[code].def;
      }

      let bbox = envelope(featureCollection(fc)).bbox;
      fitBBox(bbox, refDef);
    } else {
      // in case no feature is in the allFeatures collection (filtersettings)
      // then zoom to the beautiful city of wuppertal
      const bbox = [365438.691, 5673053.061, 381452.618, 5682901.164];
      fitBBox(bbox, projectionData[25832].def);
    }
  };
};
