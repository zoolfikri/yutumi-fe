"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";

import { CLoadingButton } from "@coreui/react-pro";
import { Sweetalert } from "@/components";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilCheckCircle } from "@coreui/icons";

const GRItemUpdate = ({ data, onSuccess }) => {
  const [loadingPost, setLoadingPost] = useState(false);

  const user_data = useSelector((state) => state.user_data);

  const postItem = (post_data) => {
    setLoadingPost(true);
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "item/create",
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    }).then(
      (response) => {
        const {
          data: { code, message },
        } = response;

        if (parseInt(code) === 201) {
          Sweetalert.fire({
            title: "Success",
            text: "Item has been created.",
            icon: "success",
          });

          if (onSuccess) {
            onSuccess();
          }
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingPost(false);
      },
      (error) => {
        if (error.response) {
          const {
            response: {
              data: { detail },
            },
          } = error;

          Sweetalert.fire({
            title: "Failed",
            text: detail,
            icon: "error",
          });
        }

        setLoadingPost(false);
      }
    );
  };

  return (
    <CLoadingButton
      className="text-white"
      color="success"
      loading={loadingPost}
      onClick={() => {
        Sweetalert.fire({
          title: "Are you sure?",
          text: "Do you want to proceed with this action?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, do it!",
          cancelButtonText: "No, cancel!",
        }).then((result) => {
          if (result.isConfirmed) {
            postItem(data);
          }
        });
      }}
    >
      <CIcon className="me-1" icon={cilCheckCircle} />
      Mark as done
    </CLoadingButton>
  );
};

export default GRItemUpdate;
