"use client";

import React from "react";
import dynamic from "next/dynamic";

import {
  CCard,
  CCardBody,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilGroup, cilPlus, cilUser } from "@coreui/icons";

const CustomerTable = dynamic(() => import("./components/CustomerTable"));

const Customer = () => {
  return (
    <CCard>
      <CCardBody>
        <div className="d-flex">
          <CDropdown className="ms-auto">
            <CDropdownToggle color="primary">
              <CIcon icon={cilPlus} className="me-1" title="Create Customer" />
              Create Customer
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href="/master/customer/create">
                <CIcon icon={cilUser} className="me-1" />
                Individual
              </CDropdownItem>
              <CDropdownItem href="/master/customer/create">
                <CIcon icon={cilGroup} className="me-1" />
                Group
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div>
        <CustomerTable />
      </CCardBody>
    </CCard>
  );
};

export default Customer;
