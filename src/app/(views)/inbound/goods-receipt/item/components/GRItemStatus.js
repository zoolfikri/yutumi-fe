import React from "react";
import classNames from "classnames";

const ItemStatus = ({ id, status, onSuccess }) => {
  const getBadge = (status) => {
    switch (String(status)) {
      case "in progress":
        return { color: "text-warning", text: "In Progress" };
      case "finish":
        return { color: "text-success", text: "Finished" };
      case "Reject":
        return { color: "text-danger", text: "Rejected" };
      default:
        return { color: "text-secondary", text: "-" };
    }
  };

  return (
    <span className={classNames(getBadge(status).color)}>
      {getBadge(status).text}
    </span>
  );
};

export default ItemStatus;
