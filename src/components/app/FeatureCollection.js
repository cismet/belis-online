import React from "react";
import { FeatureCollectionDisplay } from "react-cismap";
import { useDispatch } from "react-redux";
import { setSelectedFeature } from "../../core/store/slices/featureCollection";

const DEBUGGING = false;
const BelisFeatureCollection = ({ featureCollection, fgColor = "#000000" }) => {
  const dispatch = useDispatch();

  return (
    <div>
      {DEBUGGING && (
        <FeatureCollectionDisplay
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
        featureCollection={featureCollection}
        featureClickHandler={(event, feature) => {
          dispatch(setSelectedFeature(feature));
          console.log("feature", feature);

          console.log("event", event);
        }}
        clusteringEnabled={false}
        style={(feature) => {
          let fg = fgColor;

          const svgs = {
            tdta_leuchten: {
              svg: `
                    <svg width="12px" height="12px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="ic-adjust-24px" transform="translate(-2.000000, -2.000000)">
                                <path d="M12,2 C6.49,2 2,6.49 2,12 C2,17.51 6.49,22 12,22 C17.51,22 22,17.51 22,12 C22,6.49 17.51,2 12,2 Z M12,20 C7.59,20 4,16.41 4,12 C4,7.59 7.59,4 12,4 C16.41,4 20,7.59 20,12 C20,16.41 16.41,20 12,20 Z M15,12 C15,13.66 13.66,15 12,15 C10.34,15 9,13.66 9,12 C9,10.34 10.34,9 12,9 C13.66,9 15,10.34 15,12 Z" id="Shape" fill="${fg}" fill-rule="nonzero"></path>
                                <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                            </g>
                        </g>
                    </svg>`,
              size: 12,
              width: 12,
              height: 12,
            },
            tdta_standort_mast: {
              svg: `
                    <svg width="12px" height="12px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <path d="M12,2 C6.49,2 2,6.49 2,12 C2,17.51 6.49,22 12,22 C17.51,22 22,17.51 22,12 C22,6.49 17.51,2 12,2 Z M12,19 C8.14125,19 5,15.85875 5,12 C5,8.14125 8.14125,5 12,5 C15.85875,5 19,8.14125 19,12 C19,15.85875 15.85875,19 12,19 Z" id="Shape" fill="${fg}" fill-rule="nonzero"></path>
                            <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        </g>
                    </svg>`,
              size: 12,
            },
            schaltstelle: {
              svg: `
                    <svg width="12px" height="12px" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <path d="M38,6 L10,6 C7.79,6 6,7.79 6,10 L6,38 C6,40.21 7.79,42 10,42 L38,42 C40.21,42 42,40.21 42,38 L42,10 C42,7.79 40.21,6 38,6 Z M28,14 L34,14 L34,34 L28,34 L28,14 Z M14,14 L20,14 L20,34 L14,34 L14,14 Z" id="Shape" fill="${fg}" fill-rule="nonzero"></path>
                            <polygon id="Path" points="0 0 48 0 48 48 0 48"></polygon>
                        </g>
                    </svg>`,
              size: 20,
            },
            abzweigdose: {
              svg: `
                    <svg width="16px" height="12px" viewBox="0 0 36 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="ic-check-box-outline-blank-24px" transform="translate(6.000000, -3.000000)">
                            <path d="M19,5 L19,19 L5,19 L5,5 L19,5 L19,5 Z M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z" id="Shape" fill="${fg}" fill-rule="nonzero"></path>
                            <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        </g>
                        <path d="M9,9 L1,9" id="Line" stroke="${fg}" stroke-linecap="square"></path>
                        <path d="M18,25 L18,17" id="Line" stroke="${fg}" stroke-linecap="square"></path>
                        <path d="M35,9 L27,9" id="Line" stroke="${fg}" stroke-linecap="square"></path>
                    </g>
                    </svg>`,
              size: 20,
            },
            mauerlasche: {
              svg: `<svg width="7px" height="7px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="ic-check-box-outline-blank-24px" transform="translate(-3.000000, -3.000000)">
                            <path d="M19,5 L19,19 L5,19 L5,5 L19,5 L19,5 Z M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z" id="Shape" fill="${fg}" fill-rule="nonzero"></path>
                            <polygon id="Path" points="0 0 24 0 24 24 0 24"></polygon>
                        </g>
                    </g>
                    </svg>`,
              size: 20,
            },
          };

          //   const badge = (svgs[feature.featuretype] || {}).svg;
          //   const svgSize = (svgs[feature.featuretype] || {}).size;
          //   let canvasSize = 30;
          //   let radius = svgSize / 2; //needed for the Tooltip Positioning

          //   let svg = badge;
          //   if (feature.selected) {
          //     canvasSize = svgSize + 12;
          //   }
          //   let selectionBox = canvasSize - 6;
          //   const colorizer = () => {
          //     return "grey";
          //   };

          //   if (feature.selected) {
          //     console.log("yyy selected", feature);

          //     let selectionOffset = (canvasSize - selectionBox) / 2;

          //     let badgeDimension = svgSize - (2 * svgSize) / 12;
          //     let innerBadgeOffset = (selectionBox - badgeDimension) / 2;

          //     console.log("zzz styler", { selectionOffset, badgeDimension, innerBadgeOffset });

          //     svg =
          //       `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
          // 					<style>
          // 					/* <![CDATA[ */
          // 						#badgefor_${feature.id} .bg-fill  {
          // 							fill: ${colorizer(feature.properties)};
          // 						}
          // 						#badgefor_${feature.id} .bg-stroke  {
          // 							stroke: ${colorizer(feature.properties)};
          // 						}
          // 						#badgefor_${feature.id} .fg-fill  {
          // 							fill: white;
          // 						}
          // 						#badgefor_${feature.id} .fg-stroke  {
          // 							stroke: white;
          // 						}
          // 					/* ]]> */
          // 					</style>
          // 				<rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
          // 				<svg x="${selectionOffset + innerBadgeOffset}" y="${
          //         selectionOffset + innerBadgeOffset
          //       }" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
          //       svgSize + //feature.properties.svgBadgeDimension.width +
          //       ` ` +
          //       svgSize + //feature.properties.svgBadgeDimension.height +
          //       `">
          // 				${badge}

          // 				</svg>
          // 				</svg>`;
          //   }

          const colorizer = () => {
            return "grey";
          };

          const badge = (svgs[feature.featuretype] || {}).svg;
          let svgSize = (svgs[feature.featuretype] || {}).size;

          const badgeWidth = (svgs[feature.featuretype] || {}).width || svgSize;
          const badgeHeight = (svgs[feature.featuretype] || {}).height || svgSize;

          let radius = svgSize / 2; //needed for the Tooltip Positioning
          let canvasSize = svgSize;
          if (feature.selected) {
            canvasSize = svgSize + 22;
          }

          let selectionBox = canvasSize - 6;

          let svg = `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}"> 
						<style>
						/* <![CDATA[ */
							#badgefor_${feature.id} .bg-fill  {
								fill: ${colorizer(feature.properties)};
							}
							#badgefor_${feature.id} .bg-stroke  {
								stroke: ${colorizer(feature.properties)};
							}
							#badgefor_${feature.id} .fg-fill  {
								fill: white;
							}
							#badgefor_${feature.id} .fg-stroke  {
								stroke: white;
							}
						/* ]]> */
						</style>
					<svg x="${svgSize / 12}" y="${svgSize / 12}"  width="${svgSize - (2 * svgSize) / 12}" height="${
            svgSize - (2 * svgSize) / 12
          }" viewBox="0 0 ${badgeWidth} ${badgeHeight}">       
						${badge}
					</svg>
					</svg>  `;

          if (feature.selected) {
            let selectionOffset = (canvasSize - selectionBox) / 2;
/*x="${selectionOffset + 5}" y="${selectionOffset - 4}" */
/*x="${selectionOffset + innerBadgeOffset + 6}" y="${selectionOffset + innerBadgeOffset - 2}*/
            let badgeDimension = svgSize - (2 * svgSize) / 12;
            let innerBadgeOffset = (selectionBox - badgeDimension) / 2;
            svgSize = svgSize + 22;
            console.log("zzz offsets", { selectionOffset, badgeDimension, innerBadgeOffset });

            svg =
              `<svg id="badgefor_${feature.id}" height="${canvasSize}" width="${canvasSize}">
						<style>
						/* <![CDATA[ */
							#badgefor_${feature.id} .bg-fill  {
								fill: ${colorizer(feature.properties)};
							}
							#badgefor_${feature.id} .bg-stroke  {
								stroke: ${colorizer(feature.properties)};
							}
							#badgefor_${feature.id} .fg-fill  {
								fill: white;
							}
							#badgefor_${feature.id} .fg-stroke  {
								stroke: white;
							}
						/* ]]> */
						</style>
            <rect x="${selectionOffset}" y="${selectionOffset}" rx="8" ry="8" width="${selectionBox}" height="${selectionBox}" fill="rgba(67, 149, 254, 0.8)" stroke-width="0"/>
            <svg x="${selectionOffset + innerBadgeOffset}" y="${
                selectionOffset + innerBadgeOffset
              }" width="${badgeDimension}" height="${badgeDimension}" viewBox="0 0 ` +
              badgeWidth + //feature.properties.svgBadgeDimension.width +
              ` ` +
              badgeHeight + //feature.properties.svgBadgeDimension.height +
              `">
					${badge}
		
					</svg>
					</svg>`;
          }

          return {
            radius,
            fillColor: "red",
            color: feature.selected === true ? "#7AA8F6" : "#D3976C",
            opacity: 1,
            weight: 4,
            fillOpacity: 0.8,
            svg: svg,
            svgSize: svgSize,
          };
        }}
        //mapRef={topicMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
        showMarkerCollection={false}
      />
    </div>
  );
};
export default BelisFeatureCollection;