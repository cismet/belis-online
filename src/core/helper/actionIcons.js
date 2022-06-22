import {
  faCalendarAlt,
  faHdd,
  faLightbulb,
  faMinusSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAsterisk,
  faBatteryEmpty,
  faBinoculars,
  faBolt,
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
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const protocolActionIcons = {
  protokollStatusAenderung: (
    <span className='fa-layers fa-fw' title='Statusänderung'>
      <FontAwesomeIcon icon={faTasks}></FontAwesomeIcon>
    </span>
  ),
  leuchtenerneuerung: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faFilter} transform='rotate-180'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
    </span>
  ),
  leuchtmittelwechselEP: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faLightbulb} transform='rotate-180'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faCheckCircle} transform='shrink-9 right-10 down-5'></FontAwesomeIcon>
    </span>
  ),
  leuchtmittelwechsel: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faLightbulb} transform='rotate-180'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
    </span>
  ),
  rundsteuerempfaengerwechsel: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faMinusSquare} transform='shrink-1 left-2 up-1'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSignal} transform='shrink-9 right-10 down-5'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-11 up-5'></FontAwesomeIcon>
    </span>
  ),
  vorschaltgeraetewechsel: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faHdd} transform='rotate-90'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-11 up-5'></FontAwesomeIcon>
    </span>
  ),
  anstricharbeiten: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faPaintRoller}></FontAwesomeIcon>
    </span>
  ),
  ep: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faCheckCircle} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
    </span>
  ),
  masterneuerung: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faBatteryEmpty} transform='rotate-90 down-2'></FontAwesomeIcon>
      <FontAwesomeIcon icon={faSync} transform='shrink-9 right-10 up-5'></FontAwesomeIcon>
    </span>
  ),
  revision: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faCalendarAlt}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faCheckCircle} transform='shrink-9 right-11 down-5'></FontAwesomeIcon>
    </span>
  ),
  standsicherheitspruefung: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faBatteryEmpty} transform='rotate-90 down-2'></FontAwesomeIcon>

      <FontAwesomeIcon icon={faCheckCircle} transform='shrink-9 right-11 down-5'></FontAwesomeIcon>
    </span>
  ),
  pruefung: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faBinoculars}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faCheckCircle} transform='shrink-9 right-12 down-5'></FontAwesomeIcon>
    </span>
  ),
  sonstiges: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faStream}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faPlus} transform='shrink-9 right-12 up-0'></FontAwesomeIcon>
    </span>
  ),
};

export const addIncidentActionIcons = {
  veranlassung: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faInbox}></FontAwesomeIcon>
    </span>
  ),
  einzelauftrag: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faAsterisk} transform='shrink-9 right-11 up-5' />
    </span>
  ),
  add2arbeitsauftrag: (
    <span className='fa-layers fa-fw'>
      <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
      <FontAwesomeIcon icon={faPlus} transform='shrink-9 right-10 up-5' />
    </span>
  ),
};
