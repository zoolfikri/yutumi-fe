"use client";

import React from "react";
import dynamic from "next/dynamic";

import { CCard, CCardBody } from "@coreui/react-pro";

const POTable = dynamic(() => import("./components/POTable"));

const PurchaseOrder = () => {
  return (
    <CCard>
      <CCardBody>
        <POTable />
      </CCardBody>
    </CCard>
  );
};

export default PurchaseOrder;
