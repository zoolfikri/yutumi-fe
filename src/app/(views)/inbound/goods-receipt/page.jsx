"use client";

import React from "react";
import dynamic from "next/dynamic";

// import Link from "next/link";
import {
  // CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
} from "@coreui/react-pro";
// import CIcon from "@coreui/icons-react";
// import { cilPlus } from "@coreui/icons";

const GRTable = dynamic(() => import("./components/GRTable"));

const GoodsReceipt = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Goods Receipt List</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <GRTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default GoodsReceipt;
