import { useState } from "react";
import { useSelector } from "react-redux";
import { Modal, Upload, Button, Typography, Form, Input } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { getJWT } from "../../../core/store/slices/auth";
import uuidv4 from 'uuid/v4';
const { Text, Link } = Typography;
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
const AddImageDialog = ({
  close = () => {},
  onCancel = (output) => {},
  onClose = (output) => {},
  input = {},
}) => {
  const [imageData, setImageData] = useState();
  const jwt = useSelector(getJWT);

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

  return (
    <Modal
      title={
        <>
          <div>Foto hinzufügen</div> <Text type='secondary'>{input?.vcard?.infobox?.title}</Text>
        </>
      }
      centered
      visible={true}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            console.log(imageData);
            // const parameter = {
            //   "ImageData": imageData,
            //   "ending": "jpg",
            //   "description": "test",
            //   "objekt_id": "2",
            //   "objekt_typ": "abzweigdose",
            //   "ts": Date.now(),
            //   "prefix": "dev"
            // };
            //  d.actions.insert({
            //   id: uuidv4(),
            //   action: "uploadDocument",
            //   jwt: jwt,
            //   parameter: JSON.stringify(parameter),
            //   isCompleted: false,
            //   createdAt: new Date().toISOString(),
            //   updatedAt: new Date().toISOString(),
            //   applicationId: 'belis'
            // });
            form.resetFields();
            // console.log("values", values);

            onClose({ imageData, name: values.name, feature: input.selectedFeature });
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
          name='picture'
          label='Bild'
          rules={[
            {
              required: true,
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
          name='name'
          label='Name'
          rules={[
            {
              required: true,
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

export default AddImageDialog;
