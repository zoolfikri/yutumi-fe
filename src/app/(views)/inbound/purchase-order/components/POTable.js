"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import { CButton } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilFindInPage } from "@coreui/icons";
import Link from "next/link";

const TablePO = () => {
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
      key: "purchase_request_code",
      label: "Request Code",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "principal_id",
      label: "Principal Name",
      sorter: false,
      _style: { minWidth: "200px", width: "100%" },
    },
    {
      filter: false,
      key: "discount_1",
      sorter: false,
      _props: { className: "text-end" },
      _style: { minWidth: "100px" },
    },
    {
      filter: false,
      key: "discount_2",
      sorter: false,
      _props: { className: "text-end" },
      _style: { minWidth: "100px" },
    },
    {
      filter: false,
      key: "approval_status",
      sorter: false,
      _props: { className: "text-center" },
      _style: { minWidth: "150px" },
    },
    {
      filter: false,
      key: "action",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "126px", textAlign: "center" },
    },
  ];

  const getPurchaseOrders = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `pruchase_order/get-po/`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
        params: {
          page: activePage,
          per_page: itemsPerPage,
          ...columnFilter,
          ...columnSorter,
        },
      })
        .then((response) => {
          const {
            data: { data },
          } = response;

          setRecords(10);
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
    getPurchaseOrders();
  }, [getPurchaseOrders]);

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
        created_at: (item) => (
          <td>{moment(item.created_at).format("DD MMM YYYY")}</td>
        ),
        status: (item) => <td className="text-center">{item}</td>,
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/inbound/purchase-order/detail?id=${item.id}`}>
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

export default TablePO;
