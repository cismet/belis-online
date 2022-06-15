import { projectionData } from "react-cismap/constants/gis";
import { bufferBBox } from "./gisHelper";
import { convertBBox2Bounds } from "react-cismap/tools/gisHelper";
import envelope from "@turf/envelope";
import { getType } from "@turf/invariant";

export const zoomToFeature = ({ feature, mapRef }) => {
  console.log("xxx zoomToFeature", mapRef);
  const bufferAroundObject = 50;
  let refDef;
  if (feature.crs) {
    const code = feature?.crs?.properties?.name?.split("EPSG::")[1];
    refDef = projectionData[code].def;
  } else {
    refDef = projectionData["25832"].def;
  }
  if (mapRef !== undefined) {
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
      const bufferedBBox = bufferBBox(bbox, bufferAroundObject);
      // console.log("xxx buffered_bbox", bufferedBBox);
      mapRef.fitBounds(convertBBox2Bounds(bufferedBBox, refDef));
    }
  }
};
