import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const Visible = ({ when, children }) => {
  const userData = useSelector((state) => state.user_data);
  const shouldRender =
    typeof when === "function" ? when(userData) : Boolean(when);

  if (shouldRender) {
    return <>{children}</>;
  }

  return <></>;
};

Visible.propTypes = {
  when: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).isRequired,
  children: PropTypes.node,
};

export default Visible;
