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

const DeliveryNoteTable = dynamic(() =>
  import("./components/DeliveryNoteTable")
);

const DeliveryNote = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Delivery Notes</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <div className="d-flex mb-3">
            <Link passHref href="/inbound/goods-receipt" className="ms-auto">
              <CButton color="primary">
                <CIcon icon={cilPlus} className="me-1" />
                Create GR
              </CButton>
            </Link>
          </div>
          <DeliveryNoteTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default DeliveryNote;
