import React, { ElementType } from "react";
import {
  cilLibrary,
  cilArrowThickFromLeft,
  cilArrowThickToLeft,
  cilCalendarCheck,
  cilMoney,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem } from "@coreui/react-pro";

export type Badge = {
  color: string;
  text: string;
};

export type NavItem = {
  component: string | ElementType;
  name: string | JSX.Element;
  icon?: string | JSX.Element;
  badge?: Badge;
  href?: string;
  items?: NavItem[];
};

const _nav = [
  {
    component: CNavGroup,
    name: "Master",
    href: "/master",
    icon: <CIcon icon={cilLibrary} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Principal",
        href: "/master/principal",
      },
      {
        component: CNavItem,
        name: "Item",
        href: "/master/item",
      },
      {
        component: CNavItem,
        name: "Customer",
        href: "/master/customer",
      },
      {
        component: CNavItem,
        name: "Sub Customer",
        href: "/master/sub-customer",
      },
      {
        component: CNavItem,
        name: "Storage",
        href: "/master/storage",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Inbound",
    href: "/inbound",
    icon: <CIcon icon={cilArrowThickToLeft} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Purchase Request",
        href: "/inbound/purchase-request",
      },
      {
        component: CNavItem,
        name: "Purchase Order",
        href: "/inbound/purchase-order",
      },
      {
        component: CNavItem,
        name: "Goods Receipt",
        href: "/inbound/goods-receipt",
      },
      {
        component: CNavItem,
        name: "Inventory",
        href: "/inbound/inventory",
      },
      {
        component: CNavItem,
        name: "Picking Area",
        href: "/inbound/picking-area",
      },
    ],
  },
  {
    component: CNavGroup,
    name: "Outbound",
    href: "/outbound",
    icon: <CIcon icon={cilArrowThickFromLeft} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Sales Order",
        href: "/outbound/sales-order",
      },
      {
        component: CNavItem,
        name: "Staging",
        href: "/outbound/staging",
      },
      {
        component: CNavItem,
        name: "Delivery Notes",
        href: "/outbound/delivery-notes",
      },
      {
        component: CNavItem,
        name: "Delivery Result",
        href: "/outbound/delivery-result",
      },
    ],
  },

  {
    component: CNavItem,
    name: "Finance",
    href: "/finance",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Approval",
    href: "/approval",
    icon: <CIcon icon={cilCalendarCheck} customClassName="nav-icon" />,
  },
];

export default _nav;
