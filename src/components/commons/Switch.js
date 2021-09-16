import React, { useState } from "react";
// import Switch from "react-ios-switch";
import { Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const Comp = (props) => {
  const [switched, setSwitched] = useState(props.switched || false);
  const change = () => {
    setSwitched((old) => !old);
    if (props.stateChanged !== undefined) {
      props.stateChanged(!switched);
    }
  };
  const size = props.size;
  return (
    <div>
      <span>
        <span
          onClick={(e) => {
            change();
            e.stopPropagation();
          }}
          className='text-primary'
          style={{ verticalAlign: "middle", marginRight: 5 }}
        >
          {props.preLabel}
        </span>
        <Switch
          disabled={props.disabled}
          style={props.toggleStyle || { verticalAlign: "middle" }}
          onChange={change}
          checked={switched}
          size={size}
        />
        <span
          onClick={(e) => {
            change();
            e.stopPropagation();
          }}
          style={{ verticalAlign: "middle", marginLeft: 5 }}
        >
          {props.postLabel}
        </span>
      </span>
    </div>
  );
};
export default Comp;
