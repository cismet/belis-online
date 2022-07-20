import envelope from "@turf/envelope";
import { getType } from "@turf/invariant";
import { projectionData } from "react-cismap/constants/gis";
import { convertBBox2Bounds } from "react-cismap/tools/gisHelper";

import { bufferBBox } from "./gisHelper";

export const zoomToFeature = ({ feature, mapRef }) => {
  const bufferAroundObject = 10;
  let refDef;
  if (feature?.crs) {
    const code = feature?.crs?.properties?.name?.split("EPSG::")[1];
    refDef = projectionData[code].def;
  } else {
    refDef = projectionData["25832"].def;
  }
  if (feature && mapRef !== undefined) {
    const type = getType(feature);
    if (type === "Point") {
      const bbox = [
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.geometry.coordinates[1],
      ];
      const bufferedBBox = bufferBBox(bbox, bufferAroundObject);
      mapRef.fitBounds(convertBBox2Bounds(bufferedBBox, refDef));
    } else {
      const bbox = envelope(feature.geometry).bbox;
      //create buffer around bbox
      const bufferedBBox = bufferBBox(bbox, 2);
      mapRef.fitBounds(convertBBox2Bounds(bufferedBBox, refDef));
    }
  }
  if (!feature) {
    console.trace("xxx zoomToFeature no feature");
  }
};
