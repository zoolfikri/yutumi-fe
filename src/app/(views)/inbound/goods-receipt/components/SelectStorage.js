"use client";

import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { ReactSelectAsyncPaginate } from "@/components/custom-input";
import axios from "axios";

const SelectStorage = forwardRef((props, ref) => {
  const user_data = useSelector((state) => state.user_data);

  async function getStorages(search, loadedOptions, { page }) {
    const response = await axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `inventory/get_storage`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      params: {
        page: page,
        per_page: 10,
        search,
      },
    });

    const {
      data: { data },
    } = response;

    const options = data.map((record) => {
      return {
        value: record.id,
        label: record.storage_name,
      };
    });

    return {
      options: options,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  }

  return (
    <ReactSelectAsyncPaginate
      {...props}
      additional={{
        page: 1,
      }}
      loadOptions={getStorages}
      ref={ref}
    />
  );
});

SelectStorage.displayName = "SelectStorage";

export default SelectStorage;
