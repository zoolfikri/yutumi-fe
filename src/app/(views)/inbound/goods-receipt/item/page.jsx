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

const GRItemTable = dynamic(() => import("./components/GRItemTable"));

const GRItem = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Good Receipt Put Away Item List</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <GRItemTable />
          {/* Action Button */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <Link href="/inbound/goods-receipt">
              <CButton className="w-100" color="secondary">
                Back
              </CButton>
            </Link>
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default GRItem;
