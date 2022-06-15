import {
  faCalendarAlt,
  faCalendarCheck,
  faHdd,
  faLightbulb,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAsterisk,
  faBatteryEmpty,
  faBinoculars,
  faBolt,
  faCalendarDay,
  faCheckCircle,
  faFileInvoice,
  faFilter,
  faInbox,
  faPaintRoller,
  faPlus,
  faSignal,
  faStream,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
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
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faFilter} transform='rotate-180'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Leuchtmittelwechsel mit EP",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faLightbulb} transform='rotate-180'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-10 down-5'
            ></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Leuchtmittelwechsel",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faLightbulb} transform='rotate-180'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Rundsteuerempfängerwechsel",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon
              icon={faMinusSquare}
              transform='shrink-1 left-2 up-1'
            ></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSignal} transform='shrink-9 right-10 down-5'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-11 up-5'></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Vorschaltgerätewechsel",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faHdd} transform='rotate-90'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-11 up-5'></FontAwesomeIcon>
          </span>
        ),
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
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faPaintRoller}></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Elektrische Prüfung",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-10 up-5'
            ></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Masterneuerung",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faBatteryEmpty} transform='rotate-90 down-2'></FontAwesomeIcon>
            <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Revision",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-11 down-5'
            ></FontAwesomeIcon>
          </span>
        ),
        onClick: () => {
          // const dialog = (
          // );
          // dispatch(showDialog(dialog));
        },
      });
      subs.push({
        title: "Standsicherheitsprüfung",
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faBatteryEmpty} transform='rotate-90 down-2'></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-11 down-5'
            ></FontAwesomeIcon>
          </span>
        ),
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
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-11 down-5'
            ></FontAwesomeIcon>
          </span>
        ),
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
        iconspan: (
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faBinoculars}></FontAwesomeIcon>
            <FontAwesomeIcon
              icon={faCheckCircle}
              transform='shrink-9 right-12 down-5'
            ></FontAwesomeIcon>
          </span>
        ),
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
    iconspan: (
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faStream}></FontAwesomeIcon>
        <FontAwesomeIcon icon={faPlus} transform='shrink-9 right-12 up-0'></FontAwesomeIcon>
      </span>
    ),
    onClick: () => {
      // const dialog = (
      // );
      // dispatch(showDialog(dialog));
    },
  });
  return subs;
};
