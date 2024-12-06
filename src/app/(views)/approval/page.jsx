"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import { CCard, CCardBody, CNav, CNavItem, CNavLink } from "@coreui/react-pro";
import { Visible } from "@/components";

const PRTable = dynamic(() => import("./components/PRTable"));
const SOTable = dynamic(() => import("./components/SOTable"));

const PR = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const activeTab = tab ? parseInt(tab) : 1;

  return (
    <CCard>
      <CCardBody>
        <CNav variant="underline-border">
          <CNavItem>
            <CNavLink href="/approval?tab=1" active={activeTab === 1}>
              Purchase Request
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/approval?tab=2" active={activeTab === 2}>
              Sales Order
            </CNavLink>
          </CNavItem>
        </CNav>

        <Visible when={activeTab === 1}>
          <PRTable />
        </Visible>
        <Visible when={activeTab === 2}>
          <SOTable />
        </Visible>
      </CCardBody>
    </CCard>
  );
};

export default PR;
