"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import Link from "next/link";
import { CButton } from "@coreui/react-pro";
import { Visible } from "@/components";
import { InputMaskNumber } from "@/components/custom-input";
import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import GRStatus from "./GRStatus";
import CIcon from "@coreui/icons-react";
import { cilFindInPage, cilPenAlt } from "@coreui/icons";

const GRTable = () => {
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
      key: "goods_receipt_code",
      label: "GR Code",
      sorter: false,
      _style: { minWidth: "160px", width: "100%" },
    },
    {
      filter: false,
      key: "purchase_request_id",
      label: "Principal",
      sorter: false,
      _style: { minWidth: "160px", width: "100%" },
    },
    {
      filter: false,
      key: "created_at",
      label: "Date Created",
      sorter: false,
      _style: { minWidth: "150px" },
    },
    {
      filter: false,
      key: "purchase_request_id",
      label: "Put Away Status",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "200px", textAlign: "center" },
    },
    {
      filter: false,
      key: "action",
      sorter: false,
      _classes: "text-center",
      _style: { minWidth: "232px", textAlign: "center" },
    },
  ];

  const getGRs = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `goods_receipt/get-gr/`,
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
    getGRs();
  }, [getGRs]);

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
        total_items: (item) => (
          <td>
            <InputMaskNumber
              className="p-0 text-end"
              plainText
              value={item.total_items ? String(item.total_items) : "0"}
            />
          </td>
        ),
        created_at: (item) => (
          <td>{moment(item.created_at).format("DD MMM YYYY")}</td>
        ),
        status: (item) => (
          <td className="text-center">
            <GRStatus status={item.approval_status} />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/inbound/goods-receipt/item?id=${item.id}`}>
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
              <Visible when={true}>
                <Link href={`/inbound/goods-receipt/put-away?id=${item.id}`}>
                  <CButton color="warning" size="sm">
                    <CIcon icon={cilPenAlt} className="me-1" />
                    Put Away
                  </CButton>
                </Link>
              </Visible>
            </div>
          </td>
        ),
      }}
    />
  );
};

export default GRTable;
