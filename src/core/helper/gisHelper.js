import proj4 from "proj4";
import { proj4crs3857def } from "react-cismap/constants/gis";

export const convertBounds2BBox = (bounds, refDef = proj4crs3857def) => {
  const projectedNE = proj4(proj4.defs("EPSG:4326"), refDef, [
    bounds._northEast.lng,
    bounds._northEast.lat,
  ]);
  const projectedSW = proj4(proj4.defs("EPSG:4326"), refDef, [
    bounds._southWest.lng,
    bounds._southWest.lat,
  ]);
  return {
    left: projectedSW[0],
    top: projectedNE[1],
    right: projectedNE[0],
    bottom: projectedSW[1],
  };
};
