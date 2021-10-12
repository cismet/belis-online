import { Descriptions, Badge } from "antd";
// import FeatureInfoTitle from "./FeatureInfoTitle";
// import FeatureInfoValue from "./FeatureInfoValue";

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

export const getDate = (d) => {
  if (d) {
    return new Date(Date.parse(d)).toLocaleDateString();
  } else {
    return undefined;
  }
};

export const getStrasse = (streetObject) => {
  if (streetObject) {
    return (
      <div>
        {convertToProperUpperLowerCase(streetObject.strasse)} ({streetObject.pk})
      </div>
    );
  }
};

export const convertToProperUpperLowerCase = (string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
};

export const collectEvents = (item, eventPath) => {};

// const FeatureInfoTitleValue = ({ title, value }) => {
//   // if (value !== undefined) {
//   //   return (
//   //     <div>
//   //       <FeatureInfoTitle
//   //         style={{ display: "inline", paddingRight: "5px", fontWeight: "bold" }}
//   //         title={title}
//   //       />
//   //       <FeatureInfoValue style={{ display: "inline" }} value={value} />
//   //     </div>
//   //   );
//   // } else {
//   //   return <div />;
//   // }
//   console.log("XXX", title, value);
//   if (value !== undefined) {
//     return <Descriptions.Item label={title}>{value}</Descriptions.Item>;
//   } else {
//     return <div />;
//   }
// };

const CollComp = ({ header = "Header", bsStyle = "success", content, children }) => {
  // const [expanded, setExpanded] = useState(false);

  // if (expanded) {
  //   return (
  //     <div
  //       onClick={() => {
  //         setExpanded(false);
  //       }}
  //     >
  //       <div style={{ fontWeight: "bold", cursor: "pointer" }}>{"v " + header}</div>
  //       <div style={{ paddingLeft: "5px" }}>{content || children}</div>
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div
  //       onClick={() => {
  //         setExpanded(true);
  //       }}
  //       style={{ fontWeight: "bold", cursor: "pointer" }}
  //     >
  //       {"> " + header}
  //     </div>
  //   );
  // }

  return (
    <Descriptions layout='horizontal' bordered>
      {children}
    </Descriptions>
  );
};
