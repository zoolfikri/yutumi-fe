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

const PickingAreaTable = dynamic(() => import("./components/PickingAreaTable"));

const PickingArea = () => {
  return (
    <CCard>
      <CCardHeader>
        <h4>Picking Area</h4>
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
                <CIcon
                  icon={cilPlus}
                  className="me-1"
                  title="Create PickingArea"
                />
                Replenishment
              </CButton>
            </Link>
          </div>
          <PickingAreaTable />
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default PickingArea;
