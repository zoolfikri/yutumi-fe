"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const PRTable = dynamic(() => import("./components/PRTable"));

const PR = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link
            passHref
            href="/inbound/purchase-request/create"
            className="ms-auto"
          >
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create PR" />
              Create Purchase Request
            </CButton>
          </Link>
        </div>
        <PRTable />
      </CCardBody>
    </CCard>
  );
};

export default PR;
