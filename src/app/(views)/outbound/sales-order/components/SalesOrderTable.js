"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import Link from "next/link";
import { CButton } from "@coreui/react-pro";
import { InputMask } from "@/components/custom-input";
import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import SalesOrderDelete from "./SalesOrderDelete";
import SalesOrderStatusToggle from "./SalesOrderStatusToggle";
import CIcon from "@coreui/icons-react";
import { cilFindInPage, cilPenAlt } from "@coreui/icons";

const SalesOrderTable = () => {
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
      key: "sales_order_code",
      label: "Sales Order Code",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "customer_id",
      label: "Customer",
      sorter: false,
      _style: { minWidth: "150px", width: "100%" },
    },
    {
      filter: false,
      key: "principal_id",
      label: "SalesOrder",
      sorter: false,
      _style: { minWidth: "150px" },
    },
    {
      filter: false,
      key: "sales_order_date",
      label: "Sales Order Date",
      sorter: false,
      _style: { minWidth: "150px", textAlign: "center" },
    },
    {
      filter: false,
      key: "exp_date",
      label: "Expired Date",
      sorter: false,
      _style: { minWidth: "150px", textAlign: "center" },
    },
    {
      filter: false,
      key: "ppn",
      label: "PPN",
      sorter: false,
      _style: { minWidth: "50px", textAlign: "end" },
    },
    {
      filter: false,
      key: "status",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "90px", textAlign: "center" },
    },
    {
      filter: false,
      key: "action",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "285px", textAlign: "center" },
    },
  ];

  const getSalesOrders = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `so/get-so/`,
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
          const {
            data: {
              data: { page, result, total_data, total_page },
            },
          } = response;

          setRecords(total_data);
          setItems(result);

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
    getSalesOrders();
  }, [getSalesOrders]);

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
        sales_order_date: (item) => (
          <td className="text-center">
            {moment(item.sales_order_date).format("DD MMM YYYY")}
          </td>
        ),
        exp_date: (item) => (
          <td className="text-center">
            {moment(item.exp_date).format("DD MMM YYYY")}
          </td>
        ),
        ppn: (item) => (
          <td className="text-end">
            <InputMask plainText readOnly value={String(item.ppn)} />
          </td>
        ),
        status: (item) => (
          <td className="text-center">
            <SalesOrderStatusToggle
              id={item.id}
              status={item.status}
              onSuccess={() => setFetchId((prev) => prev + 1)}
            />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/inbound/principal/detail?id=${item.id}`}>
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
              <Link href={`/inbound/principal/edit?id=${item.id}`}>
                <CButton color="warning" size="sm">
                  <CIcon icon={cilPenAlt} className="me-1" />
                  Edit
                </CButton>
              </Link>
              <SalesOrderDelete
                id={item.id}
                onSuccess={() => setFetchId((prev) => prev + 1)}
              />
            </div>
          </td>
        ),
      }}
    />
  );
};

export default SalesOrderTable;
