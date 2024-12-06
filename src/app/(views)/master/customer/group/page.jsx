"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const GroupTable = dynamic(() => import("./components/GroupTable"));

const Group = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link passHref href="/inbound/principal/create" className="ms-auto">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create Group" />
              Create Group
            </CButton>
          </Link>
        </div>
        <GroupTable />
      </CCardBody>
    </CCard>
  );
};

export default Group;
