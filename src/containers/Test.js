import React from "react";
import { Button, Dropdown, Menu, Select } from "antd";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faFile,
  faFileInvoice,
  faInbox,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import IconComp from "react-cismap/commons/Icon";
const { Option } = Select;

const Test = () => {
  const select = (
    <Select
      defaultValue='lucy'
      style={{ width: "100%" }}
      onChange={(x) => {
        console.log("change", x);
      }}
    >
      <Option value='jack'>Jack</Option>
      <Option value='lucy'>Lucy</Option>
      <Option value='disabled' disabled>
        Disabled
      </Option>
      <Option value='Yiminghe'>yiminghe</Option>
    </Select>
  );
  return (
    <>
      <div style={{ margin: 100 }}>{select}</div>
      <div style={{ margin: 100 }}></div>
    </>
  );
};
export default Test;
