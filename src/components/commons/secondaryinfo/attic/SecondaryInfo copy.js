import React, { useState } from "react";
import { version as reactCismapVersion } from "react-cismap/meta";
import SecondaryInfo from "./Secondary";
import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";
import {
  getFeatureCollection,
  getSelectedFeature,
  setSecondaryInfoVisible,
} from "../../../../core/store/slices/featureCollection";
import { useDispatch, useSelector } from "react-redux";
import { getVCard } from "../../../../core/helper/featureHelper";
import FeatureInfoTitle from "./FeatureInfoTitle";
import FeatureInfoValue from "./FeatureInfoValue";
// import { getApplicationVersion } from "../version";

// const CollComp = ({ header = "Header", bsStyle = "success", content, children }) => {
//   const [expanded, setExpanded] = useState(false);

//   if (expanded) {
//     return (
//       <div
//         onClick={() => {
//           setExpanded(false);
//         }}
//       >
//         <div style={{ fontWeight: "bold", cursor: "pointer" }}>{"v " + header}</div>
//         <div style={{ paddingLeft: "5px" }}>{content || children}</div>
//       </div>
//     );
//   } else {
//     return (
//       <div
//         onClick={() => {
//           setExpanded(true);
//         }}
//         style={{ fontWeight: "bold", cursor: "pointer" }}
//       >
//         {"> " + header}
//       </div>
//     );
//   }
// };

// const footer = (
//   <div style={{ fontSize: "11px" }}>
//     <div>
//       <b>{/* {document.title} v{getApplicationVersion()} */}</b>:{" "}
//       <a href='https://cismet.de/' target='_cismet'>
//         cismet GmbH
//       </a>{" "}
//       auf Basis von{" "}
//       <a href='http://leafletjs.com/' target='_more'>
//         Leaflet
//       </a>{" "}
//       und{" "}
//       <a href='https://cismet.de/#refs' target='_cismet'>
//         {/* cids | react-cismap v{reactCismapVersion} */}
//       </a>{" "}
//       |{" "}
//       <a
//         target='_blank'
//         rel='noopener noreferrer'
//         href='https://cismet.de/datenschutzerklaerung.html'
//       >
//         Datenschutzerklärung (Privacy Policy)
//       </a>
//     </div>
//   </div>
// );

// const FeatureInfoTitleValue = ({ title, value }) => {
//   if (value !== undefined) {
//     return (
//       <div>
//         <FeatureInfoTitle
//           style={{ display: "inline", paddingRight: "5px", fontWeight: "bold" }}
//           title={title}
//         />
//         <FeatureInfoValue style={{ display: "inline" }} value={value} />
//       </div>
//     );
//   } else {
//     return <div />;
//   }
// };

// const getStandortMast = (strasse, mast) => {
//   if (mast.haus_nr === undefined) {
//     return (
//       <CollComp header='Straße' bsStyle='def'>
//         <FeatureInfoTitleValue title='Straße' value={strasse.strasse} />
//         <FeatureInfoTitleValue title='Schlüssel' value={strasse?.pk} />
//         <FeatureInfoTitleValue title='Stadtbezirk' value={mast.stadtbezirk.bezirk} />
//         <FeatureInfoTitleValue title='Standortangabe' value={mast?.standortangabe} />
//       </CollComp>
//     );
//   } else {
//     return (
//       <CollComp header='Straße/Hausnummer' bsStyle='def'>
//         <FeatureInfoTitleValue
//           title='Straße Hausnummer'
//           value={strasse.strasse + " " + mast.haus_nr}
//         />
//         <FeatureInfoTitleValue title='Schlüssel' value={strasse?.pk} />
//         <FeatureInfoTitleValue title='Stadtbezirk' value={mast.stadtbezirk.bezirk} />
//         <FeatureInfoTitleValue title='Standortangabe' value={mast?.standortangabe} />
//       </CollComp>
//     );
//   }
// };

// const getMast = (mast) => {
//   return (
//     <CollComp header='Mast'>
//       <FeatureInfoTitleValue title='Masttyp' value={mast?.masttyp?.masttyp} />
//       <FeatureInfoTitleValue
//         title='Klassifizierung'
//         value={mast?.klassifizierung?.klassifizierung}
//       />
//       <FeatureInfoTitleValue title='Anlagengruppe' value={mast?.anlagengruppeObject?.bezeichnung} />
//       <FeatureInfoTitleValue
//         title='Unterhalt'
//         value={mast?.unterhaltspflicht_mast?.unterhalt_mast}
//       />
//       <FeatureInfoTitleValue title='Mastschutz erneuert am' value={mast.mastschutz} />
//       <FeatureInfoTitleValue title='Inbetriebnahme am' value={getDate(mast.inbetriebnahme_mast)} />
//       <FeatureInfoTitleValue title='letzter Mastanstrich am' value={getDate(mast.mastanstrich)} />
//       <FeatureInfoTitleValue title='Montagefirma' value={mast.montagefirma} />
//       {mast.verrechnungseinheit && <FeatureInfoValue value='Verrechnungseinheit' />}
//       <FeatureInfoTitle title='Developerinfo' />
//       <FeatureInfoTitle title='Key' />
//       <FeatureInfoValue value={"tdta_standort_mast/" + mast.id} />
//     </CollComp>
//   );
// };

// const getLeuchtmittel = (leuchte) => {
//   return (
//     <CollComp header='Leuchtmittel'>
//       <FeatureInfoTitleValue title='Masttyp' value={leuchte?.masttyp?.masttyp} />
//       <FeatureInfoTitleValue
//         title='Klassifizierung'
//         value={leuchte?.klassifizierung?.klassifizierung}
//       />
//     </CollComp>
//   );
// };

// const getStrasse = (strasse) => {
//   return (
//     <CollComp header='Straße'>
//       <FeatureInfoTitleValue title='Strasse' value={strasse?.strasse} />
//       <FeatureInfoTitleValue title='Schlüssel' value={strasse?.pk} />
//     </CollComp>
//   );
// };

// const getDoppelkommandos = (
//   anschlussleistung1,
//   anzahlDk1,
//   dk,
//   anschlussleistung2,
//   anzahlDk2,
//   dk2
// ) => {
//   return (
//     <CollComp header='Doppelkommandos'>
//       <FeatureInfoTitleValue title='Doppelkommando 1' value={dk?.pk} />
//       <FeatureInfoTitleValue title='Anzahl Doppelkommando 1' value={anzahlDk1} />
//       <FeatureInfoTitleValue title='Anschlussleistung DK 1' value={anschlussleistung1} />
//       <FeatureInfoTitleValue title='Doppelkommando 2' value={dk2?.pk} />
//       <FeatureInfoTitleValue title='Anzahl Doppelkommando 2' value={anzahlDk2} />
//       <FeatureInfoTitleValue title='Anschlussleistung DK 2' value={anschlussleistung2} />
//     </CollComp>
//   );
// };

// const getDate = (d) => {
//   if (d !== undefined) {
//     return new Date(Date.parse(d)).toLocaleDateString();
//   } else {
//     return "";
//   }
// };

// const getSeparator = (name) => {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "12px",
//         borderBottom: "1px solid #eeeeee",
//         textAlign: "center",
//         marginBottom: "15px",
//         marginTop: "5px",
//       }}
//     >
//       <span
//         style={{ fontSize: "16px", backgroundColor: "#FFFFFF", xcolor: "#aaa", padding: "0 10px" }}
//       >
//         {name}
//       </span>
//     </div>
//   );
// };

// const InfoPanel = () => {
//   const dispatch = useDispatch();
//   const selectedFeature = useSelector(getSelectedFeature);
//   const hit = JSON.parse(JSON.stringify(selectedFeature));

//   //remove geometry and feature reference
//   delete hit.geometry;
//   delete hit.properties.feature;

//   const hits = [hit];
//   //    const { history } = useContext(TopicMapContext);
//   //    const lat = new URLSearchParams(history.location.search).get("lat");
//   //    const long = new URLSearchParams(history.location.search).get("lng");
//   const lat = 51;
//   const long = 7;
//   //   const showRawData = new URLSearchParams(history.location.search).get("showRawData") !== null;
//   const showRawData = true;

//   //   const hitObject = objectifyHits(hits);

//   if (hit !== undefined) {
//     const subSections = [];

//     const display = (desc, value, valFunc) => {
//       if (value && valFunc === undefined && Array.isArray(value) === false) {
//         return (
//           <div>
//             <b>{desc}:</b> {value}
//           </div>
//         );
//       } else if (value && valFunc === undefined && Array.isArray(value) === true) {
//         return (
//           <div>
//             <b>{desc}:</b> {value.join(", ")}
//           </div>
//         );
//       } else if (value && valFunc !== undefined) {
//         return (
//           <div>
//             <b>{desc}:</b> {valFunc(value)}
//           </div>
//         );
//       }
//     };

//     const hitObject = objectifyHits(hits);

//     if (hits !== undefined) {
//       if (hitObject.tdta_leuchten) {
//         subSections.push(
//           <SecondaryInfoPanelSection
//             key={"leuchten" + hitObject.id}
//             bsStyle='success'
//             header={"Leuchten"}
//           >
//             {hitObject.tdta_leuchten &&
//               hitObject.tdta_leuchten.map((value, index) => {
//                 let vCard = getVCard(value);
//                 return (
//                   <div key={"leuchte_" + index}>
//                     {index > 0 && <br></br>}
//                     <FeatureInfoTitle title={vCard.subtitle} />
//                     <FeatureInfoTitleValue
//                       title='Inbetriebnahme'
//                       value={getDate(value.inbetriebnahme_leuchte)}
//                     />
//                     {value.fk_standort !== undefined &&
//                       getStandortMast(value.fk_strassenschluessel, value.fk_standort)}
//                     {value.fk_standort !== undefined && getMast(value.fk_standort)}
//                     <FeatureInfoTitleValue
//                       title='Energielieferant'
//                       value={value.energielieferant}
//                     />
//                     <FeatureInfoTitleValue
//                       title='Rundsteuerempfänger'
//                       value={value.rundsteuerempfänger}
//                     />
//                     <FeatureInfoTitleValue title='Unterhalt' value={value.energielieferant} />
//                     <FeatureInfoValue
//                       value={value.zaehler === true ? "Zähler vorhanden" : "kein Zähler vorhanden"}
//                     />
//                     {value.anzahl_1dk !== undefined &&
//                       getDoppelkommandos(
//                         value.anschlussleistung_1dk,
//                         value.anzahl_1dk,
//                         value.fk_dk1,
//                         value.anschlussleistung_2dk,
//                         value.anzahl_2dk,
//                         value.fk_dk2
//                       )}
//                     {(value.masttyp?.masttyp !== undefined ||
//                       value.klassifizierung?.klassifizierung) &&
//                       getLeuchtmittel(value)}
//                     <FeatureInfoTitleValue
//                       title='Montagefirma'
//                       value={value.montagefirma_leuchte}
//                     />
//                     <FeatureInfoTitleValue title='Bemerkungen' value={value.bemerkungen} />
//                     {/* todo: Dokumente */}
//                     <FeatureInfoTitleValue
//                       title='Developerinfo'
//                       value={"TDTA_LEUCHTEN/" + value.id}
//                     />
//                     <br />
//                   </div>
//                 );
//               })}
//           </SecondaryInfoPanelSection>
//         );
//       }

//       if (hitObject.mauerlasche) {
//         subSections.push(
//           <SecondaryInfoPanelSection
//             key={"mauerlasche" + hitObject.id}
//             bsStyle='success'
//             header={"Mauerlaschen"}
//           >
//             {hitObject.mauerlasche &&
//               hitObject.mauerlasche.map((value, index) => {
//                 let vCard = getVCard(value);
//                 return (
//                   <div key={"mauerlasche_" + index}>
//                     {index > 0 && <br></br>}
//                     <FeatureInfoValue value={vCard.title} />
//                     <FeatureInfoTitleValue
//                       title='Straße'
//                       value={value?.fk_strassenschluessel?.strasse}
//                     />
//                     <FeatureInfoTitleValue
//                       title='Developerinfo'
//                       value={"MAUERLASCHE/" + value.id}
//                     />
//                     <br />
//                   </div>
//                 );
//               })}
//           </SecondaryInfoPanelSection>
//         );
//       }

//       if (hitObject.Leitung) {
//         subSections.push(
//           <SecondaryInfoPanelSection
//             key={"leitung" + hitObject.id}
//             bsStyle='success'
//             header={"Leitungen"}
//           >
//             {hitObject.Leitung &&
//               hitObject.Leitung.map((value, index) => {
//                 let vCard = getVCard(value);
//                 return (
//                   <div key={"leitung_" + index}>
//                     {index > 0 && <br></br>}
//                     <FeatureInfoValue value={vCard.title} />
//                     <FeatureInfoTitleValue
//                       title='Material'
//                       value={value.fk_material === undefined ? "-" : value.fk_material.bezeichnung}
//                     />
//                     <FeatureInfoTitleValue
//                       title='Querschnitt'
//                       value={value?.fk_querschnitt?.groesse}
//                     />
//                     <FeatureInfoTitleValue title='Developerinfo' value={"LEITUNG/" + value.id} />
//                     <br />
//                   </div>
//                 );
//               })}
//           </SecondaryInfoPanelSection>
//         );
//       }

//       if (hitObject.schaltstelle) {
//         subSections.push(
//           <SecondaryInfoPanelSection
//             key={"schaltstelle" + hitObject.id}
//             bsStyle='success'
//             header={"Schaltstellen"}
//           >
//             {hitObject.schaltstelle &&
//               hitObject.schaltstelle.map((value, index) => {
//                 let vCard = getVCard(value);
//                 return (
//                   <div key={"schaltstelle_" + index}>
//                     {index > 0 && <br></br>}
//                     <FeatureInfoValue value={vCard.title} />
//                     {value?.fk_strassenschluessel !== undefined &&
//                       getStrasse(value.fk_strassenschluessel)}
//                     <FeatureInfoTitleValue
//                       title='Developerinfo'
//                       value={"SCHALTSTELLE/" + value.id}
//                     />
//                     <br />
//                   </div>
//                 );
//               })}
//           </SecondaryInfoPanelSection>
//         );
//       }

//       if (hitObject.schaltstelle) {
//         subSections.push(
//           <SecondaryInfoPanelSection
//             key={"schaltstelle" + hitObject.id}
//             bsStyle='success'
//             header={"Schaltstellen"}
//           >
//             {hitObject.schaltstelle &&
//               hitObject.schaltstelle.map((value, index) => {
//                 let vCard = getVCard(value);
//                 return (
//                   <div key={"schaltstelle_" + index}>
//                     {index > 0 && <br></br>}
//                     <FeatureInfoValue value={vCard.title} />
//                     {value?.fk_strassenschluessel !== undefined &&
//                       getStrasse(value.fk_strassenschluessel)}
//                     <FeatureInfoTitleValue
//                       title='Developerinfo'
//                       value={"SCHALTSTELLE/" + value.id}
//                     />
//                     <br />
//                   </div>
//                 );
//               })}
//           </SecondaryInfoPanelSection>
//         );
//       }

//       if (showRawData) {
//         //remove the geometries
//         const hitsForRawDisplay = JSON.parse(JSON.stringify(hits));

//         for (const hit of hitsForRawDisplay) {
//           delete hit.geojson;
//         }

//         const hitObjectForRawDisplay = objectifyHits(hitsForRawDisplay);

//         subSections.push(
//           <SecondaryInfoPanelSection
//             key='standort'
//             bsStyle='info'
//             header={"Trefferobjekte (Raw Data ohne Geometrie): " + hits.length + " Treffer"}
//           >
//             <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
//               <pre key='hitObject'>{JSON.stringify(hitObjectForRawDisplay, null, 2)}</pre>
//               {/* <pre key='hits'>{JSON.stringify(hitsForRawDisplay, null, 2)}</pre> */}
//             </div>
//           </SecondaryInfoPanelSection>
//         );
//       }
//     }
//     return (
//       <SecondaryInfo
//         visible={true}
//         setVisibleState={(state) => {
//           dispatch(setSecondaryInfoVisible(state));
//         }}
//         titleIconName='info-circle'
//         title={
//           "Datenblatt zu: " +
//           Math.round(lat * 10000) / 10000 +
//           ", " +
//           Math.round(long * 1000) / 1000
//         }
//         mainSection={
//           <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
//             <div>
//               Die Suche an der angegebene Position hat insgesamt {hits.length} Treffer ergeben:
//               {display("Bezeichnung", hits?.bezeichnung)}
//               {display("Flächengröße", hits?.groesse, (a) => (
//                 <span>
//                   {a.toLocaleString()} m² (circa{" "}
//                   {(Math.round((a / 10000) * 10) / 10).toLocaleString()} ha)
//                 </span>
//               ))}
//               {display("Stadtbezirk(e)", hits?.stadtbezirke, (sb) => sb.join(", "))}
//               {display("Quartier(e)", hits?.quartiere, (q) => q.join(", "))}
//               {display("Eigentümer", hits?.eigentuemer, (e) => e.join(", "))}
//             </div>
//           </div>
//         }
//         subSections={subSections}
//         footer={footer}
//       />
//     );
//   } else {
//     return null;
//   }
// };
// export default InfoPanel;
