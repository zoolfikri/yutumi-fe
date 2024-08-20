import React from "react";

import { useSelector } from "react-redux";
import axios from "axios";

import { Sweetalert as Swal } from "@/components";
import { CButton } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";

const DeleteButton = ({ id, onSuccess }) => {
  const user_data = useSelector((state) => state.user_data);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this principal!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios({
          method: "POST",
          baseURL: process.env.NEXT_PUBLIC_API_URL,
          url: `principal/delete_principal/${id}`,
          headers: {
            Authorization: `Bearer ${user_data.access_token}`,
          },
        })
          .then((response) => {
            // Handle success response
            Swal.fire("Deleted!", "The principal has been deleted.", "success");
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

  return (
    <CButton color="danger" onClick={handleDelete} size="sm">
      <CIcon icon={cilTrash} className="me-1" />
      Delete
    </CButton>
  );
};

export default DeleteButton;
