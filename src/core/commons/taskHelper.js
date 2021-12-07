import { faCheckCircle, faHdd, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faBomb,
  faCamera,
  faExclamation,
  faExclamationTriangle,
  faSpinner,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type2Caption } from "../helper/featureHelper";
import { gold, red, blue, green } from "@ant-design/colors";

const getTitleForAction = (action) => {
  switch (action) {
    case "uploadDocument":
      return <FontAwesomeIcon icon={faCamera} title='Foto hinzufügen' />;
    case "addIncident":
      return <FontAwesomeIcon icon={faExclamationTriangle} title='Störung melden' />;
    default:
      return action;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case undefined:
      return (
        <FontAwesomeIcon
          style={{ color: gold[4] }}
          icon={faHdd}
          title='Aktion im Browser hinterlegt'
        ></FontAwesomeIcon>
      );
    case 202:
      return (
        <FontAwesomeIcon
          style={{ color: blue[5] }}
          spin
          icon={faSpinner}
          title='Aktion wird ausgeführt'
        />
      );
    case 200:
      return (
        <FontAwesomeIcon
          style={{ color: green[4] }}
          icon={faCheckCircle}
          title='Aktion wurde erfolgreich ausgeführt'
        />
      );
    case 401:
      return (
        <FontAwesomeIcon
          style={{ color: gold[6] }}
          icon={faUserSlash}
          title='Aktion kann wegen abgelaufenem Token nicht ausgeführt werden.'
        />
      );
    case 500:
      return (
        <FontAwesomeIcon
          style={{ color: red[4] }}
          icon={faExclamation}
          title='Aktion konnte nicht ausgeführt werden.'
        />
      );
    default:
      return (
        <FontAwesomeIcon
          style={{ color: red[6] }}
          icon={faBomb}
          title={"unbekannter Status:" + status}
        />
      );
  }
};

export const createDescriptionForTask = (type, parameters) => {
  switch (type) {
    case "uploadDocument":
      return parameters.description;
    case "addIncident":
      return "tbd";
    default:
      return "";
  }
};

export const getTaskForAction = (resultObject) => {
  //result.properties has values for
  //  id
  //  jwt
  //  createdAt
  //  updatedAt
  //  applicationId
  //  isCompleted
  //  action
  //  paramter
  //  result
  //  body
  //  status

  if (resultObject) {
    const {
      id,
      jwt,
      createdAt,
      updatedAt,
      applicationId,
      isCompleted,
      action,
      parameter,
      result,
      body,
      status,
    } = resultObject;

    let parameters = {};
    try {
      parameters = JSON.parse(parameter);
    } catch (e) {}

    const task = {
      aktion: getTitleForAction(action),
      datum: updatedAt || createdAt,
      statustext: getStatusIcon(status),
      fachobjekt:
        type2Caption(parameters.objekt_typ) +
        " " +
        (parameters.object_name ? parameters.object_name : ""),
      beschreibung: createDescriptionForTask(action, parameters),
      status: getStatusIcon(status),
      statusCode: status,
    };
    console.log("task", task);

    return task;
  }
};
