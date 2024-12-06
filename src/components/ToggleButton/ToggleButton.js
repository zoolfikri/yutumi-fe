import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CButton } from "@coreui/react-pro";

const ToggleButton = ({ active, children, text, ...props }) => {
  return (
    <CButton
      {...props}
      className={classNames("btn-toggle", active ? "active" : "")}
    >
      {text || children}
    </CButton>
  );
};

ToggleButton.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
};

export default ToggleButton;
