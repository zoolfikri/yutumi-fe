"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import Link from "next/link";
import { CButton } from "@coreui/react-pro";
import { InputMask } from "@/components/custom-input";
import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import CIcon from "@coreui/icons-react";
import { cilFindInPage } from "@coreui/icons";

const DeliveryResultTable = () => {
  const [activePage, setActivePage] = useState(1);
  const [columnFilter, setColumnFilter] = useState([]);
  const [columnSorter, setColumnSorter] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [records, setRecords] = useState(null);
  const [fetchId, setFetchId] = useState(1);

  const user_data = useSelector((state) => state.user_data);

  const columns = [
    {
      filter: false,
      key: "name",
      label: "Name",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "total_so",
      label: "Total SO",
      sorter: false,
      _props: { className: "text-end" },
      _style: { minWidth: "150px", width: "100%" },
    },
    {
      filter: false,
      key: "created_at",
      label: "Created at",
      sorter: false,
      _style: { minWidth: "150px", textAlign: "center" },
    },
    {
      filter: false,
      key: "action",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "126px", textAlign: "center" },
    },
  ];

  const getDeliveryResults = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `delivery/get-delivery-notes`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
        params: {
          page: activePage,
          size: itemsPerPage,
          ...columnFilter,
          ...columnSorter,
        },
      })
        .then((response) => {
          // const {
          //   data: {
          //     data: { page, result, total_data, total_page },
          //   },
          // } = response;

          const {
            data: { data },
          } = response;

          setRecords(data.length);
          setItems(data);

          setItemsLoading(false);
        })
        .catch((error) => {
          setItemsLoading(false);
        });
    }
  }, [
    fetchId,
    activePage,
    columnFilter,
    columnSorter,
    itemsPerPage,
    user_data.access_token,
  ]);

  useEffect(() => {
    getDeliveryResults();
  }, [getDeliveryResults]);

  return (
    <CustomizedTable
      columns={columns}
      items={items}
      itemsPerPage={itemsPerPage}
      itemsPerPageSelect
      loading={itemsLoading}
      onActivePageChange={(activePage) => {
        setActivePage(activePage);
      }}
      onColumnFilterChange={(filter) => {
        setActivePage(1);
        setColumnFilter(filter);
      }}
      onItemsPerPageChange={(itemsPerPage) => {
        setActivePage(1);
        setItemsPerPage(itemsPerPage);
      }}
      onSorterChange={(sorter) => setColumnSorter(sorter)}
      paginationProps={{
        activePage: activePage,
        pages: Math.ceil(records / itemsPerPage) || 1,
      }}
      scopedColumns={{
        name: (item) => <td>{item.delivery_note?.name}</td>,
        total_so: (item) => (
          <td>
            <InputMask
              className="text-end"
              plainText
              readOnly
              value={String(item.total_so)}
            />
          </td>
        ),
        created_at: (item) => (
          <td className="text-center">
            {moment(item.created_at).format("DD MMM YYYY")}
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link
                href={`/outbound/delivery-notes/detail?id=${item.delivery_note?.id}`}
              >
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
            </div>
          </td>
        ),
      }}
    />
  );
};

export default DeliveryResultTable;
