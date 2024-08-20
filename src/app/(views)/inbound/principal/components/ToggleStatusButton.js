import React from "react";

import { useSelector } from "react-redux";
import axios from "axios";

import { Sweetalert as Swal } from "@/components";
import { CBadge, CFormSwitch } from "@coreui/react-pro";

const ToggleStatusButton = ({ id, status, onSuccess }) => {
  const user_data = useSelector((state) => state.user_data);

  const handleChange = () => {
    Swal.fire({
      title: "Are you sure?",
      text:
        status === "1"
          ? "You will not be able to recover this principal!"
          : "You will be able to recover this principal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText:
        status === "1" ? "Yes, deactivate it!" : "Yes, activate it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "POST",
          baseURL: process.env.NEXT_PUBLIC_API_URL,
          url: `principal/unactivate_principal/${id}`,
          headers: {
            Authorization: `Bearer ${user_data.access_token}`,
          },
          params: { is_active: status === "1" ? false : true },
        })
          .then((response) => {
            // Handle success response
            if (status === "1") {
              Swal.fire(
                "Deactivated!",
                "The principal has been deactivated.",
                "success"
              );
            } else {
              Swal.fire(
                "Activated!",
                "The principal has been activated.",
                "success"
              );
            }
            // Perform any additional actions after deletion
            onSuccess();
          })
          .catch((error) => {
            // Handle error response
            Swal.fire(
              "Error!",
              "An error occurred while deleting the principal.",
              "error"
            );
          });
      }
    });
  };

  const getBadge = (status) => {
    switch (status) {
      case "1":
        return { color: "success", text: "Active" };
      case "0":
        return { color: "danger", text: "Inactive" };
      default:
        return { color: "secondary", text: "Undefined" };
    }
  };

  return (
    <>
      <CBadge color={getBadge(status).color} shape="rounded-pill">
        <CFormSwitch
          checked={status === "1"}
          className="align-middle"
          color="success"
          id={`statusSwitch-${id}`}
          label={getBadge(status).text}
          onChange={handleChange}
          size="lg"
        />
      </CBadge>
    </>
  );
};

export default ToggleStatusButton;
