"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import StorageDelete from "./StorageDelete";
import StorageStatusToggle from "./StorageStatusToggle";
import { CButton } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilFindInPage, cilPenAlt } from "@coreui/icons";
import Link from "next/link";

const StorageTable = () => {
  const [activePage, setActivePage] = useState(1);
  const [columnFilter, setColumnFilter] = useState([]);
  const [columnSorter, setColumnSorter] = useState(null);
  const [itemsPerPage, setStoragesPerPage] = useState(10);
  const [items, setStorages] = useState([]);
  const [itemsLoading, setStoragesLoading] = useState(false);
  const [records, setRecords] = useState(null);
  const [fetchId, setFetchId] = useState(1);

  const user_data = useSelector((state) => state.user_data);

  const columns = [
    {
      filter: false,
      key: "storage_code",
      label: "Storage Code",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "storage_name",
      label: "Storage Name",
      sorter: false,
      _style: { minWidth: "200px", width: "100%" },
    },
    {
      filter: false,
      key: "storage_type",
      label: "Storage Type",
      sorter: false,
      _style: { minWidth: "150px" },
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

  const getStorages = useCallback(() => {
    if (fetchId) {
      setStoragesLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `storage_master/get-storage/`,
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
          setStorages(data);

          setStoragesLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setStoragesLoading(false);
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
    getStorages();
  }, [getStorages]);

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
        setStoragesPerPage(itemsPerPage);
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
        status: (item) => (
          <td className="text-center">
            <StorageStatusToggle
              id={item.id}
              status={item.status}
              onSuccess={() => setFetchId((prev) => prev + 1)}
            />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/master/item/detail?id=${item.id}`}>
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
              <Link href={`/master/item/edit?id=${item.id}`}>
                <CButton color="warning" size="sm">
                  <CIcon icon={cilPenAlt} className="me-1" />
                  Edit
                </CButton>
              </Link>
              <StorageDelete
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

export default StorageTable;
