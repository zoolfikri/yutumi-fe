"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import DeleteButton from "./DeleteButton";
import ToggleStatusButton from "./ToggleStatusButton";
import { CButton } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPenAlt } from "@coreui/icons";
import Link from "next/link";

const PrincipalTable = () => {
  const [activePage, setActivePage] = useState(1);
  const [columnFilter, setColumnFilter] = useState([]);
  const [columnSorter, setColumnSorter] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [fetchId, setFetchId] = useState(1);

  const user_data = useSelector((state) => state.user_data);

  const columns = [
    {
      key: "principal_code",
      label: "Principal Code",
      _style: { minWidth: "160px" },
    },
    {
      key: "principal_name",
      label: "Principal Name",
      _style: { minWidth: "200px" },
    },
    {
      key: "email",
      _style: { minWidth: "150px" },
    },
    {
      filter: false,
      key: "created_at",
      label: "Created At",
      sorter: false,
      _style: { minWidth: "150px" },
    },
    {
      key: "created_by",
      _style: { minWidth: "150px" },
    },
    {
      key: "status",
      _classes: "text-center",
      _style: { minWidth: "90px" },
    },
    {
      key: "action",
      _classes: "text-center",
      _style: { minWidth: "167px" },
    },
  ];

  const getItems = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `principal/get`,
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

          setRecords(100);
          setItems(data);

          setItemsLoading(false);
        })
        .catch((error) => {
          console.error(error);
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
    getItems();
  }, [getItems]);

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
        status: (item) => (
          <td className="text-center">
            <ToggleStatusButton
              id={item.id}
              status={item.status}
              onSuccess={() => setFetchId((prev) => prev + 1)}
            />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/inbound/principal/edit?id=${item.id}`}>
                <CButton color="warning" size="sm">
                  <CIcon icon={cilPenAlt} className="me-1" />
                  Edit
                </CButton>
              </Link>
              <DeleteButton
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

export default PrincipalTable;
