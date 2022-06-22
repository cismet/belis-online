import { DatePicker, Form, Input, Modal, Radio, Select, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "rxjs/internal/observable/pairs";
import { getJWT } from "../../../core/store/slices/auth";
import { renewCache } from "../../../core/store/slices/cacheControl";
import { getWorker } from "../../../core/store/slices/dexie";

import {
  getSelectedFeaturesForAllModes,
  MODES,
} from "../../../core/store/slices/featureCollection";

const { Text } = Typography;

const SetStatusDialog = ({
  close = () => {},
  onCancel = (output) => {},
  onClose = (output) => {},
  input = {},
  actionname,
  actionkey,
  title = "",
}) => {
  const selectedFeaturesForAllModes = useSelector(getSelectedFeaturesForAllModes);
  const arbeitsauftrag = selectedFeaturesForAllModes[MODES.TASKLISTS].properties;

  const [form] = Form.useForm();
  const dexieW = useSelector(getWorker);
  const jwt = useSelector(getJWT);

  const [leuchtentypen, setLeuchtentypen] = useState([]);
  const [preferredLeuchtentyp, setPreferredLeuchtentyp] = useState();

  useEffect(() => {
    //async block
    (async () => {
      if (actionkey === "leuchtenerneuerung") {
        try {
          const lts = await dexieW.getAll("tkey_leuchtentyp");
          if (lts && lts.length > 0) {
            setLeuchtentypen(lts);
          } else {
            dispatch(renewCache("tkey_leuchtentyp", jwt));
          }
        } catch (e) {
          console.log("Error in fetching teams", e);
        }
      }
    })();
  }, []);
  return (
    <Modal
      zIndex={30000001}
      title={
        <>
          <div>{title}</div> <Text type='secondary'>{input?.vcard?.infobox?.title}</Text>
        </>
      }
      centered
      visible={true}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            const feature = input.feature;
            const momentStatusDate =
              values.statusdate ||
              (input.feature?.properties?.datum
                ? moment(input.feature?.properties?.datum)
                : undefined);
            let statusD;
            if (momentStatusDate) {
              statusD = momentStatusDate.valueOf();
            }

            const inbetriebnahmeD = (values.inbetriebnahme || moment()).valueOf();

            const parameter = {
              //leuchtenerneuerung
              inbetriebnahmedatum: inbetriebnahmeD,
              leuchtentyp: values.leuchtentyp,

              //leuchtmittelwechselEP

              //sonstiges
              bemerkung: values.infos,

              //statussection
              status: values.status || input.feature?.properties?.arbeitsprotokollstatus?.id,
              protokoll_id: feature.properties.id,
              monteur: values.monteur || input.feature?.properties?.monteur,
              datum: statusD,

              //metainformation
              actionname,
              objekt_typ: "arbeitsprotokoll",
              object_name: input?.vcard?.infobox?.title + " (A" + arbeitsauftrag.nummer + ")",
            };
            Object.keys(parameter).forEach((key) =>
              parameter[key] === undefined ? delete parameter[key] : {}
            );
            form.resetFields();

            onClose(parameter);

            close();
          })
          .catch((info) => {
            console.log("Validation Failed:", info);
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
        {/* Different input fields for different actions */}

        {actionkey === "leuchtenerneuerung" && (
          <>
            <Form.Item name='inbetriebnahme' label='Inbetriebnahme'>
              <DatePicker defaultValue={moment()} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name='leuchtentyp' label='Leuchtentyp'>
              <Select
                showSearch
                defaultValue={preferredLeuchtentyp?.id}
                style={{ width: "100%" }}
                filterOption={(input, option) => {
                  const testChilds = option.children.map((child) => child.toLowerCase().trim());
                  return testChilds.join(" ").search(input.toLowerCase().trim()) >= 0;
                }}
                optionFilterProp='children'
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .join(" ")
                    .toLowerCase()
                    .localeCompare(optionB.children.join(" ").toLowerCase())
                }
                // onChange={(x) => {
                //   setSelectedTeamId(x);
                // }}
              >
                {leuchtentypen.map((typ) => {
                  return (
                    <Select.Option value={typ.id}>
                      {typ.leuchtentyp} - {typ.fabrikat}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </>
        )}

        {actionkey === "sonstiges" && (
          <Form.Item
            name='infos'
            rules={[
              {
                required: true,
                message: "Bitte geben Sie hier die Informationen an.",
              },
            ]}
            label='Informationen zu Ihrer durchgeführten Tätigkeit'
          >
            <TextArea rows={4} />
          </Form.Item>
        )}

        {/* For every ProtocolAction the same */}
        <div class='ant-col ant-form-item-label'>
          <label for='form_in_modal_date'>Status</label>
        </div>
        <Form.Item name='status' noStyle={true} label='Status'>
          <Radio.Group
            style={{ width: "100%", marginBottom: 15 }}
            defaultValue={input.feature?.properties?.arbeitsprotokollstatus?.id}
            buttonStyle='solid'
          >
            <Radio.Button style={{ width: "33%", textAlign: "center", fontSize: 12 }} value={1}>
              in Bearbeitung
            </Radio.Button>
            <Radio.Button style={{ width: "33%", textAlign: "center", fontSize: 12 }} value={2}>
              erledigt
            </Radio.Button>
            <Radio.Button style={{ width: "33%", textAlign: "center", fontSize: 12 }} value={3}>
              Fehlmeldung
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='monteur'
          label='Monteur'
          rules={[
            {
              required: input.feature?.properties?.monteur === undefined,
              message: "Bitte geben den Namen des Monteurs an.",
            },
          ]}
        >
          <Input defaultValue={input.feature?.properties?.monteur} />
        </Form.Item>

        <Form.Item name='statusdate' label='Datum'>
          <DatePicker
            defaultValue={
              input.feature?.properties?.datum ? moment(input.feature?.properties?.datum) : moment()
            }
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SetStatusDialog;
