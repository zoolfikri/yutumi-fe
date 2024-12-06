"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import moment from "moment";

import Link from "next/link";
import { CButton } from "@coreui/react-pro";
import CustomizedTable from "@/components/CustomizedTable/CustomizedTable";
import PrincipalDelete from "./PrincipalDelete";
import PrincipalStatusToggle from "./PrincipalStatusToggle";
import CIcon from "@coreui/icons-react";
import { cilFindInPage, cilPenAlt } from "@coreui/icons";

const PrincipalTable = () => {
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
      key: "principal_code",
      label: "Principal Code",
      sorter: false,
      _style: { minWidth: "160px" },
    },
    {
      filter: false,
      key: "principal_name",
      label: "Principal Name",
      sorter: false,
      _style: { minWidth: "200px", width: "50%" },
    },
    {
      filter: false,
      key: "email",
      sorter: false,
      _style: { minWidth: "150px", width: "50%" },
    },
    {
      filter: false,
      key: "phone_number",
      label: "Phone Number",
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

  const getPrincipals = useCallback(() => {
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
    getPrincipals();
  }, [getPrincipals]);

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
            <PrincipalStatusToggle
              id={item.id}
              status={item.status}
              onSuccess={() => setFetchId((prev) => prev + 1)}
            />
          </td>
        ),
        action: (item) => (
          <td className="text-center">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Link href={`/master/principal/detail?id=${item.id}`}>
                <CButton color="info" size="sm">
                  <CIcon icon={cilFindInPage} className="me-1" />
                  View Detail
                </CButton>
              </Link>
              <Link href={`/master/principal/edit?id=${item.id}`}>
                <CButton color="warning" size="sm">
                  <CIcon icon={cilPenAlt} className="me-1" />
                  Edit
                </CButton>
              </Link>
              <PrincipalDelete
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
