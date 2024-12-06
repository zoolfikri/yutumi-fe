"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const SalesOrderTable = dynamic(() => import("./components/SalesOrderTable"));

const SalesOrder = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link
            passHref
            href="/outbound/sales-order/create"
            className="ms-auto"
          >
            <CButton color="primary">
              <CIcon
                icon={cilPlus}
                className="me-1"
                title="Create SalesOrder"
              />
              Create Sales Order
            </CButton>
          </Link>
        </div>
        <SalesOrderTable />
      </CCardBody>
    </CCard>
  );
};

export default SalesOrder;
