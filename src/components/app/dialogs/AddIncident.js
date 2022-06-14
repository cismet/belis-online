import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Upload, Button, Typography, Form, Input, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { getJWT } from "../../../core/store/slices/auth";
import uuidv4 from "uuid/v4";
import { getDB } from "../../../core/store/slices/offlineActionDb";
import extensions from "../../../core/helper/extensions";
import TextArea from "antd/lib/input/TextArea";
import { getWorker } from "../../../core/store/slices/dexie";
import { renewCache } from "../../../core/store/slices/cacheControl";
import { getTeam } from "../../../core/store/slices/team";
const { Text, Link } = Typography;
const { Option } = Select;
export const ADD_INCIDENT_MODES = {
  VERANLASSUNG: "VERANLASSUNG",
  EINZELAUFTRAG: "EINZELAUFTRAG",
  ADD2ARBEITSAUFTRAG: "ADD2ARBEITSAUFTRAG",
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    callback(reader.result);
  });
  reader.readAsDataURL(img);
};
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
const AddIncidentDialog = ({
  close = () => {},
  onCancel = (output) => {},
  onClose = (output) => {},
  input = {},
}) => {
  const dispatch = useDispatch();
  const jwt = useSelector(getJWT);

  const dexieW = useSelector(getWorker);
  const [teams, setTeams] = useState([]);
  const [preferredIncidentTeam, setPreferredIncidentTeam] = useState();
  const myTeam = useSelector(getTeam);
  useEffect(() => {
    //async block
    (async () => {
      try {
        const teams = await dexieW.getAll("team");
        if (teams && teams.length > 0) {
          setTeams(teams);
        } else {
          dispatch(renewCache("team", jwt));
        }
      } catch (e) {
        console.log("Error in fetching teams");
      }
    })();
  }, []);
  const [imageData, setImageData] = useState();
  console.log("AddIncidentDialog", input);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        //info.file.imageData=imageUrl;
        setImageData(imageUrl);
      });
    }
  };
  const [form] = Form.useForm();
  let modeinfo;
  if (input.mode === ADD_INCIDENT_MODES.VERANLASSUNG) {
    modeinfo = "(Es wird nur eine Veranlassung angelegt.)";
  } else if (input.mode === ADD_INCIDENT_MODES.EINZELAUFTRAG) {
    modeinfo = "(Ein Einzelauftrag wird angelegt.)";
  } else if (input.mode === ADD_INCIDENT_MODES.ADD2ARBEITSAUFTRAG) {
    modeinfo = "(A" + input.arbeitsauftrag.properties.nummer + " wird ergänzt)";
  }

  return (
    <Modal
      zIndex={30000001}
      title={
        <>
          <div>Störung melden {modeinfo}</div>{" "}
          <Text type='secondary'>{input?.vcard?.infobox?.title}</Text>
        </>
      }
      centered
      visible={true}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // imageData comes from state not from values

            // const mimeType = imageData.match("data:(.*);")[1];
            // const ending = extensions[mimeType];
            // const feature = input.feature;

            const parameter = { erstmal: "nochnix" };
            // const parameter = {
            //   ImageData: imageData,
            //   ending,
            //   description: values.name,
            //   objekt_id: feature.properties.id,
            //   objekt_typ: feature.featuretype,
            //   object_name: feature.properties.name,
            //   ts: Date.now(),
            //   prefix: "dev", //the dev prefix should only be set in a dev environment to protect the webdav from cluttering
            // };

            form.resetFields();
            onClose(parameter);
            close();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      onCancel={() => {
        onCancel();
        close();
      }}
      okButtonProps={{ disabled: false }}
      cancelButtonProps={{ disabled: false }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name='title'
          label='Bezeichnung'
          rules={[
            {
              required: true,
              message: "Bitte geben Sie eine Bezeichnung an.",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {input.mode === ADD_INCIDENT_MODES.EINZELAUFTRAG && (
          <Form.Item name='team' label='Team'>
            <Select
              defaultValue={preferredIncidentTeam?.id || myTeam?.id}
              style={{ width: "100%" }}
              onChange={(x) => {
                console.log("change", x);
              }}
            >
              {teams.map((team) => (
                <Option value={team.id}>{team.name}</Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name='description' label='Beschreibung'>
          <TextArea />
        </Form.Item>
        <Form.Item name='remarks' label='Bemerkungen'>
          <TextArea />
        </Form.Item>
        <Form.Item
          name='picture'
          label='Bild'
          rules={[
            {
              required: false,
              message: "Bitte wählen Sie ein Bild aus.",
            },
          ]}
        >
          <Upload
            //style={{ width: "100%" }}
            name='upload'
            _listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            // beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={dummyRequest}
          >
            <Button style_={{ width: "100%" }} icon={<UploadOutlined />}>
              Foto aufnehmen oder schon aufgenommenes Foto auswählen
            </Button>
          </Upload>
        </Form.Item>

        <div style={{ marginTop: 20 }}>
          {imageData && (
            <div>
              <img src={imageData} alt='avatar' style={{ width: "100%", marginBottom: 20 }} />
            </div>
          )}
        </div>
        <Form.Item
          name='picname'
          label='Bildname'
          rules={[
            {
              required: false,
              message: "Bitte geben Sie eine Namen für das Bild an.",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddIncidentDialog;
