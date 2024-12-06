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

const DeliveryResultTable = dynamic(() =>
  import("./components/DeliveryResultTable")
);

const DeliveryResult = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Delivery Result</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <div className="d-flex mb-3">
            <Link passHref href="/inbound/goods-receipt" className="ms-auto">
              <CButton color="primary">
                <CIcon icon={cilPlus} className="me-1" />
                Create DR
              </CButton>
            </Link>
          </div>
          <DeliveryResultTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default DeliveryResult;
