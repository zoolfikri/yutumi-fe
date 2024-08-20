"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const PrincipalTable = dynamic(() => import("./components/PrincipalTable"));

const Principal = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link passHref href="/inbound/principal/create" className="ms-auto">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create Principal" />
              Create Principal
            </CButton>
          </Link>
        </div>
        <PrincipalTable />
      </CCardBody>
    </CCard>
  );
};

export default Principal;
