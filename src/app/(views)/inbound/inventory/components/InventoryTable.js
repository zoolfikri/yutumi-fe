"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";

const InventoryTable = () => {
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
      key: "inventory_id",
      label: "Inventory ID",
      sorter: false,
      _style: { minWidth: "120px" },
    },
    {
      filter: false,
      key: "storage_name",
      label: "Storage Name",
      sorter: false,
      _style: { minWidth: "200px", width: "50%" },
    },
    {
      filter: false,
      key: "item_id",
      label: "Item ID",
      sorter: false,
      _style: { minWidth: "120px" },
    },
    {
      filter: false,
      key: "item_name",
      label: "Item Name",
      sorter: false,
      _style: { minWidth: "200px", width: "50%" },
    },
    {
      filter: false,
      key: "stock",
      label: "Stock",
      sorter: false,
      _props: { className: "text-end" },
      _style: { minWidth: "100px" },
    },
  ];

  const getPurchaseOrders = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `inventory/get_all_inventory_items/`,
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
        inventory_id: (item) => <td>{item.inventory?.id}</td>,
        storage_name: (item) => <td>{item.storage?.storage_name}</td>,
        item_id: (item) => <td>{item.item?.item_code}</td>,
        item_name: (item) => <td>{item.item?.item_name}</td>,
        stock: (item) => <td className="text-end">{item.inventory?.stock}</td>,
      }}
    />
  );
};

export default InventoryTable;
