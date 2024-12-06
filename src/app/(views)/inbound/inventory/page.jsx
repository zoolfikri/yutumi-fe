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

const InventoryTable = dynamic(() => import("./components/InventoryTable"));

const Inventory = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Inventory</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <div className="d-flex mb-3">
            <Link passHref href="/inbound/goods-receipt" className="ms-auto">
              <CButton color="primary">
                <CIcon icon={cilPlus} className="me-1" title="Create PR" />
                Put Away
              </CButton>
            </Link>
          </div>
          <InventoryTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default Inventory;
