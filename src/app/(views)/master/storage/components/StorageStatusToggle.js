import React from "react";

import { useSelector } from "react-redux";
import axios from "axios";

import { Sweetalert as Swal, ToggleButton } from "@/components";

const ItemStatusToggle = ({ id, status, onSuccess }) => {
  const user_data = useSelector((state) => state.user_data);

  const handleChange = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will change the status of this item.",
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
          url: `item/unactivate_item/${id}`,
          headers: {
            Authorization: `Bearer ${user_data.access_token}`,
          },
          params: { is_active: status === "1" ? false : true },
        })
          .then((response) => {
            const {
              data: { code, message },
            } = response;

            // Handle error response
            if (parseInt(code) !== 200) {
              Swal.fire("Failed", message || "An error occurred.", "error");
              return;
            }
            // Handle success response
            Swal.fire("Success", message, "success");
            // Perform any additional actions after deletion
            onSuccess();
          })
          .catch((error) => {
            const {
              response: {
                data: { detail },
              },
            } = error;

            // Handle error response
            Swal.fire("Failed", detail || "An error occurred.", "error");
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
    <ToggleButton
      active={status === "1"}
      onClick={handleChange}
      text={getBadge(status).text}
    />
  );
};

export default ItemStatusToggle;
