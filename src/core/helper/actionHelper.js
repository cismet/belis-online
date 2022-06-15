import React from "react";
import AddImageDialog from "../../components/app/dialogs/AddImage";
import AddIncidentDialog, { ADD_INCIDENT_MODES } from "../../components/app/dialogs/AddIncident";
import addIncidentAction from "../store/slices/actionSubslices/addIncidentAction";
import { showDialog } from "../store/slices/app";
import {
  MODES as FEATURECOLLECTION_MODES,
  setSecondaryInfoVisible,
} from "../store/slices/featureCollection";
import { addImageToObjectAction } from "../store/slices/offlineActionDb";
import { addIncidentActionIcons, protocolActionIcons } from "./actionIcons";
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
      tooltip: "Status ändern",
      onClick: () => {},
      iconname: "tasks",
    });
    const actionSubs = getSubActionInfoForProtocolAction({ selectedFeature, dispatch });
    if (actionSubs?.length === 1) {
      actionLinkInfos.push({
        tooltip: actionSubs[0].tooltip || actionSubs[0].title,
        iconspan: actionSubs[0].iconspan,
        onClick: actionSubs[0].onClick,
      });
    } else {
      actionLinkInfos.push({
        tooltip: "Aktionen",
        iconname: "list-alt",
        subs: actionSubs,
      });
    }
  }

  return actionLinkInfos;
};

const getSubActionInfoForAddIncident = ({ selectedFeature, selectedArbeitsauftrag, dispatch }) => {
  const vcard = getVCard(selectedFeature);
  let subs = [
    {
      tooltip: "Nur Veranlassung",
      title: "Nur Veranlassung",
      iconspan: addIncidentActionIcons.veranlassung,
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
      iconspan: addIncidentActionIcons.einzelauftrag,
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
      iconspan: addIncidentActionIcons.add2arbeitsauftrag,
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

const getSubActionInfoForProtocolAction = ({ selectedFeature, dispatch }) => {
  console.log("selectedFeature", selectedFeature);
  const type = selectedFeature.fachobjekttype;
  console.log("type", type);

  const subs = [];
  switch (type) {
    case "geom":
      break;
    case "tdta_leuchten":
      subs.push({
        title: "Leuchtenerneuerung",
        iconspan: protocolActionIcons.leuchtenerneuerung,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Leuchtmittelwechsel mit EP",
        iconspan: protocolActionIcons.leuchtmittelwechselEP,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Leuchtmittelwechsel",
        iconspan: protocolActionIcons.leuchtmittelwechsel,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Rundsteuerempfängerwechsel",
        iconspan: protocolActionIcons.rundsteuerempfaengerwechsel,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Vorschaltgerätewechsel",
        iconspan: protocolActionIcons.vorschaltgeraetewechsel,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });

      break;
    case "tdta_standort_mast":
      subs.push({
        title: "Anstricharbeiten",
        iconspan: protocolActionIcons.anstricharbeiten,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Elektrische Prüfung",
        iconspan: protocolActionIcons.ep,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Masterneuerung",
        iconspan: protocolActionIcons.masterneuerung,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Revision",
        iconspan: protocolActionIcons.revision,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Standsicherheitsprüfung",
        iconspan: protocolActionIcons.standsicherheitspruefung,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      break;
    case "leitung":
      break;
    case "schaltstelle":
      subs.push({
        title: "Revision",
        iconspan: protocolActionIcons.revision,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      break;
    case "abzweigdose":
      break;

    case "mauerlasche":
      subs.push({
        title: "Prüfung",
        iconspan: protocolActionIcons.pruefung,
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      break;

    default:
      console.log("unknown featuretype. this should not happen", type);
  }
  subs.push({
    tooltip: "Sonstiges",
    title: "Sonstiges",
    iconspan: protocolActionIcons.sonstiges,
    onClick: () => {
      // const dialog = (
      // );
      // dispatch(showDialog(dialog));
    },
  });
  return subs;
};
