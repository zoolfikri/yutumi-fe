"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import moment from "moment";

import { InputMaskNumber } from "@/components/custom-input";
import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import GRItemStatus from "./GRItemStatus";
import GRItemUpdate from "./GRItemUpdate";

const GRItemTable = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

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
      key: "item_id",
      label: "Item Name",
      sorter: false,
      _style: { minWidth: "160px", width: "40%" },
    },
    {
      filter: false,
      key: "item_id",
      label: "Principal",
      sorter: false,
      _style: { minWidth: "160px", width: "30%" },
    },
    {
      filter: false,
      key: "qty",
      label: "Qty",
      sorter: false,
      _style: { minWidth: "50px", textAlign: "end" },
    },
    {
      filter: false,
      key: "put_away_status",
      label: "Put Away Status",
      sorter: false,
      _style: { minWidth: "150px", textAlign: "center" },
    },
    {
      filter: false,
      key: "id",
      label: "Inventory Code",
      sorter: false,
      _style: { minWidth: "160px", width: "30%" },
    },
    {
      filter: false,
      key: "action",
      sorter: false,
      _style: { minWidth: "160px", textAlign: "center" },
    },
  ];

  const getGRItems = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `goods_receipt/get-gr-item/${id}`,
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
    id,
  ]);

  useEffect(() => {
    getGRItems();
  }, [getGRItems]);

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
        qty: (item) => (
          <td>
            <InputMaskNumber
              className="p-0 text-end"
              plainText
              value={
                item.item_receipt_qty ? String(item.item_receipt_qty) : "0"
              }
            />
          </td>
        ),
        created_at: (item) => (
          <td>{moment(item.created_at).format("DD MMM YYYY")}</td>
        ),
        put_away_status: (item) => (
          <td className="text-center">
            <GRItemStatus status={item.put_away_status} />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <GRItemUpdate
                data={item}
                onSuccess={() => {
                  setFetchId(fetchId + 1);
                }}
              />
            </div>
          </td>
        ),
      }}
    />
  );
};

export default GRItemTable;
