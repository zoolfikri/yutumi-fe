"use client";

import React from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import { CButton, CCard, CCardBody } from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";

const ItemTable = dynamic(() => import("./components/ItemTable"));

const Item = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <Link passHref href="/master/item/create" className="ms-auto">
            <CButton color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create Item" />
              Create Item
            </CButton>
          </Link>
        </div>
        <ItemTable />
      </CCardBody>
    </CCard>
  );
};

export default Item;
