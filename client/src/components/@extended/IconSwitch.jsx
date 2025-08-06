// components/IconSwitch.jsx
import React from "react";
import { Switch, Space } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const IconSwitch = ({
  label,
  checked,
  name,
  onChange,
  checkedIcon = <CheckOutlined />,
  uncheckedIcon = <CloseOutlined />,
  ...props
}) => {
  return (
    <Space>
      {label && <span>{label}</span>}
      <Switch
        checked={checked}
        onChange={(value) => onChange(name, value)}
        checkedChildren={checkedIcon}
        unCheckedChildren={uncheckedIcon}
        {...props}
      />
    </Space>
  );
};

export default IconSwitch;
