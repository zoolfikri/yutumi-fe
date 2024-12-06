"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const StorageTable = dynamic(() => import("./components/StorageTable"));

const Storage = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link passHref href="/master/storage/create" className="ms-auto">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create Storage" />
              Create Storage
            </CButton>
          </Link>
        </div>
        <StorageTable />
      </CCardBody>
    </CCard>
  );
};

export default Storage;
