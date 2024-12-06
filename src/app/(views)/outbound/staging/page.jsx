"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const StagingTable = dynamic(() => import("./components/StagingTable"));

const Staging = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Staging</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <div className="d-flex">
            <Link
              passHref
              href="/outbound/staging/replenishment"
              className="ms-auto"
            >
              <CButton color="primary">
                <CIcon icon={cilPlus} className="me-1" title="Create Staging" />
                Replenishment
              </CButton>
            </Link>
          </div>
          <StagingTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default Staging;
