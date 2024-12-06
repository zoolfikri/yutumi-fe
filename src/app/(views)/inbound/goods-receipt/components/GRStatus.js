import React from "react";
import classNames from "classnames";

const GRStatus = ({ id, status, onSuccess }) => {
  const getBadge = (status) => {
    switch (String(status)) {
      case "Pending":
        return { color: "text-warning", text: "Waiting for approval" };
      case "Approved":
        return { color: "text-success", text: "Approved" };
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

export default GRStatus;
