import React from "react";

const StagingStatus = ({ status }) => {
  const getBadge = (status) => {
    switch (Boolean(status)) {
      case true:
        return { color: "text-success", text: "Active" };
      case false:
        return { color: "text-danger", text: "Inactive" };
      default:
        return { color: "text-secondary", text: "Undefined" };
    }
  };

  return (
    <span className={getBadge(status).color}>{getBadge(status).text}</span>
  );
};

export default StagingStatus;
