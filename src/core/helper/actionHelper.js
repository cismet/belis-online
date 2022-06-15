import { faAsterisk, faFileInvoice, faInbox, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import AddImageDialog from "../../components/app/dialogs/AddImage";
import AddIncidentDialog, { ADD_INCIDENT_MODES } from "../../components/app/dialogs/AddIncident";
import store from "../store";
import addIncidentAction from "../store/slices/actionSubslices/addIncidentAction";
import { showDialog } from "../store/slices/app";
import {
  MODES as FEATURECOLLECTION_MODES,
  setSecondaryInfoVisible,
} from "../store/slices/featureCollection";
import { addImageToObjectAction } from "../store/slices/offlineActionDb";
import { getVCard } from "./featureHelper";
import { zoomToFeature } from "./mapHelper";

export const getObjectActionInfos = ({
  selectedFeature,
  selectedArbeitsauftrag,
  refRoutedMap,
  mode,
  dispatch,
}) => {
  const type = selectedFeature.featuretype;
  const vcard = getVCard(selectedFeature);

  const actionLinkInfos = [
    {
      tooltip: "Auf Objekt zoomen",
      onClick: () => {
        zoomToFeature({
          selectedFeature,
          mapRef: refRoutedMap.current.leafletMap.leafletElement,
        });
      },
      iconname: "search-location",
    },
  ];

  if (mode === FEATURECOLLECTION_MODES.OBJECTS) {
    if (
      selectedFeature?.featuretype !== "Leitung" &&
      selectedFeature?.featuretype !== "abzweigdose"
    ) {
      actionLinkInfos.push({
        tooltip: "Öffne Datenblatt",
        onClick: () => {
          dispatch(setSecondaryInfoVisible(true));
        },
        iconname: "info",
      });
    }
    actionLinkInfos.push({
      tooltip: "Foto hinzufügen",
      onClick: () => {
        const dialog = (
          <AddImageDialog
            close={() => {
              dispatch(showDialog());
            }}
            input={{ feature: selectedFeature, vcard }}
            onClose={(addImageParamater) => {
              dispatch(addImageToObjectAction(addImageParamater));
            }}
          />
        );
        dispatch(showDialog(dialog));
      },
      iconname: "camera",
    });
    let subs = getSubActionInfoForAddIncident({
      selectedFeature,
      selectedArbeitsauftrag,
      dispatch,
    });
    actionLinkInfos.push({
      tooltip: "Störung meldenn",
      subs,
      iconname: "exclamation-triangle",
    });
  } else if (mode === FEATURECOLLECTION_MODES.TASKLISTS) {
    actionLinkInfos.push({
      tooltip: "Öffne Datenblatt",
      onClick: () => {
        dispatch(setSecondaryInfoVisible(true));
      },
      iconname: "info",
    });
  } else {
    //Protocols
    actionLinkInfos.push({
      tooltip: "Öffne Datenblatt",
      onClick: () => {
        dispatch(setSecondaryInfoVisible(true));
      },
      iconname: "info",
    });
    actionLinkInfos.push({
      tooltip: "Aktionen",
      onClick: () => {},
      iconname: "list-alt",
    });
    actionLinkInfos.push({
      tooltip: "Status ändern",
      onClick: () => {},
      iconname: "list-alt",
    });
  }
  //
  //   switch (type) {
  //     case "leitung":
  //       break;
  //     case "mauerlasche":
  //       break;
  //     case "schaltstelle":
  //       break;
  //     case "Leitung":
  //       break;
  //     case "abzweigdose":
  //       break;
  //     case "tdta_standort_mast":
  //       break;
  //     case "arbeitsprotokoll":
  //       const subtype = feature.subtype;
  //       switch (subtype) {
  //         case "Leitung":
  //           break;
  //         case "leitung":
  //           break;
  //         case "mauerlasche":
  //           break;
  //         case "schaltstelle":
  //           break;
  //         case "abzweigdose":
  //           break;
  //         case "tdta_standort_mast":
  //           break;
  //         case "arbeitsprotokoll":
  //           break;
  //         case "arbeitsauftrag":
  //           break;
  //         default:
  //           console.log("unknown featuresubtype. this should not happen", subtype);
  //           break;
  //       }
  //       break;
  //     case "arbeitsauftrag":
  //       break;
  //     default:
  //       console.log("unknown featuretype. this should not happen", type);
  //       break;
  //   }

  return actionLinkInfos;
};

const getSubActionInfoForAddIncident = ({ selectedFeature, selectedArbeitsauftrag, dispatch }) => {
  const vcard = getVCard(selectedFeature);
  let subs = [
    {
      tooltip: "Nur Veranlassung",
      title: "Nur Veranlassung",
      iconspan: (
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faInbox}></FontAwesomeIcon>
        </span>
      ),
      onClick: () => {
        const dialog = (
          <AddIncidentDialog
            close={() => {
              dispatch(showDialog());
            }}
            input={{ feature: selectedFeature, vcard, mode: ADD_INCIDENT_MODES.VERANLASSUNG }}
            onClose={(params) => {
              dispatch(addIncidentAction(params));
            }}
          />
        );

        dispatch(showDialog(dialog));
      },
    },
    {
      tooltip: "Einzelauftrag",
      title: "Einzelauftrag",
      iconspan: (
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
          <FontAwesomeIcon icon={faAsterisk} transform='shrink-9 right-11 up-5' />
        </span>
      ),
      onClick: () => {
        const dialog = (
          <AddIncidentDialog
            close={() => {
              dispatch(showDialog());
            }}
            input={{ feature: selectedFeature, vcard, mode: ADD_INCIDENT_MODES.EINZELAUFTRAG }}
            onClose={(params) => {
              dispatch(addIncidentAction(params));
            }}
          />
        );

        dispatch(showDialog(dialog));
      },
    },
  ];

  if (selectedArbeitsauftrag) {
    subs.push({
      tooltip: "Arbeitsauftrag ergänzen",
      title: selectedArbeitsauftrag.properties.nummer + " ergänzen",
      // iconname: "exclamation-triangle",
      iconspan: (
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
          <FontAwesomeIcon icon={faPlus} transform='shrink-9 right-10 up-5' />
        </span>
      ),
      onClick: () => {
        const dialog = (
          <AddIncidentDialog
            close={() => {
              dispatch(showDialog());
            }}
            input={{
              feature: selectedFeature,
              vcard,
              mode: ADD_INCIDENT_MODES.ADD2ARBEITSAUFTRAG,
              arbeitsauftrag: selectedArbeitsauftrag,
            }}
            onClose={(params) => {
              dispatch(addIncidentAction(params));
            }}
          />
        );
        dispatch(showDialog(dialog));
      },
    });
  }
  return subs;
};

const getSubActionInfoForProtocolAction = ({
  selectedFeature,
  selectedArbeitsauftrag,
  dispatch,
}) => {
  const subs = [
    {
      tooltip: "Sonstiges",
      title: "Sonstiges",
      iconspan: (
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faInbox}></FontAwesomeIcon>
        </span>
      ),
      onClick: () => {
        // const dialog = (
        //   <AddIncidentDialog
        //     close={() => {
        //       dispatch(showDialog());
        //     }}
        //     input={{ feature: selectedFeature, vcard, mode: ADD_INCIDENT_MODES.VERANLASSUNG }}
        //     onClose={(params) => {
        //       dispatch(addIncidentAction(params));
        //     }}
        //   />
        // );
        // dispatch(showDialog(dialog));
      },
    },
  ];
  return subs;
};
