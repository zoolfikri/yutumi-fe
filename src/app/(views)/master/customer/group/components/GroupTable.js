"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import axios from "axios";
import moment from "moment";

import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import GroupDelete from "./GroupDelete";
import GroupStatusToggle from "./GroupStatusToggle";
import { CButton } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilFindInPage, cilPenAlt } from "@coreui/icons";
import Link from "next/link";

const GroupTable = () => {
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
      key: "customer_code",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "customer_name",
      sorter: false,
      _style: { minWidth: "200px", width: "50%" },
    },
    {
      filter: false,
      key: "address",
      sorter: false,
      _style: { minWidth: "150px", width: "50%" },
    },
    {
      filter: false,
      key: "customer_type",
      label: "Type",
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

  const getGroups = useCallback(() => {
    if (fetchId) {
      setItemsLoading(true);

      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `sub_customer/get/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
        params: {
          cust_id: id,
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
    id,
    user_data.access_token,
  ]);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

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
            <GroupStatusToggle
              id={item.id}
              status={item.status}
              onSuccess={() => setFetchId((prev) => prev + 1)}
            />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/inbound/customer/detail?id=${item.id}`}>
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
              <Link href={`/inbound/customer/edit?id=${item.id}`}>
                <CButton color="warning" size="sm">
                  <CIcon icon={cilPenAlt} className="me-1" />
                  Edit
                </CButton>
              </Link>
              <GroupDelete
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

export default GroupTable;
