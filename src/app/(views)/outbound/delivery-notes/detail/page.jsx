"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CLoadingButton,
  CSmartTable,
} from "@coreui/react-pro";
import { InputMask } from "@/components/custom-input";
import { Sweetalert } from "@/components";

import axios from "axios";

const DeliveryNoteView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loading_get_delivery_note, setLoadingGetDeliveryNote] =
    useState(false);
  const [delivery_notes, setDeliveryNotes] = useState([]);

  const user_data = useSelector((state) => state.user_data);

  const getDeliveryNote = useCallback(
    (id) => {
      setLoadingGetDeliveryNote(true);
      axios({
        method: "POST",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `delivery/get-delivery-notes-detail/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { code, data, message },
          } = response;
          if (parseInt(code) === 200) {
            const temp_delivery_notes = [];

            data.forEach((delivery_note) => {
              const {
                sales_order: { sales_order_code, customer_id, principal_id },
                sales_order_items,
              } = delivery_note;

              let temp_sales_order = {
                sales_order_code,
                customer_id,
                principal_id,
                _cellProps: {
                  sales_order_code: {
                    // color: "light",
                    rowSpan: sales_order_items.length,
                    scope: "rowgroup",
                  },
                  customer_id: {
                    // color: "light",
                    rowSpan: sales_order_items.length,
                    scope: "rowgroup",
                  },
                  principal_id: {
                    // color: "light",
                    rowSpan: sales_order_items.length,
                    scope: "rowgroup",
                  },
                },
              };

              sales_order_items.forEach((sales_order_item, index) => {
                const { item_id, quantity } = sales_order_item;

                if (index === 0) {
                  temp_sales_order.item_id = item_id;
                  temp_sales_order.quantity = quantity;
                  temp_delivery_notes.push(temp_sales_order);
                } else {
                  temp_delivery_notes.push({
                    item_id,
                    quantity,
                  });
                }
              });
            });

            setDeliveryNotes(temp_delivery_notes);
          } else {
            Sweetalert.fire({
              title: "Failed",
              text: message,
              icon: "error",
            });
          }

          setLoadingGetDeliveryNote(false);
        },
        (error) => {
          if (error.response) {
            const {
              response: {
                data: { detail },
              },
            } = error;

            Sweetalert.fire({
              title: "Failed",
              text: detail,
              icon: "error",
            });
          }

          setLoadingGetDeliveryNote(false);
        }
      );
    },
    [user_data.access_token]
  );

  // Get users data when component mounted
  useEffect(() => {
    getDeliveryNote(id);
  }, [getDeliveryNote, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Delivery Notes Detail</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CSmartTable
            columns={[
              {
                key: "sales_order_code",
                label: "SO Code",
                _props: { scope: "col" },
                _style: { width: "33%", minWidth: "100px" },
              },
              {
                key: "customer_id",
                label: "Customer",
                _props: { scope: "col" },
                _style: { width: "33%", minWidth: "100px" },
              },
              {
                key: "principal_id",
                label: "Principal",
                _props: { scope: "col" },
                _style: { width: "33%", minWidth: "100px" },
              },
              {
                key: "item_id",
                label: "Item",
                _props: { scope: "col" },
                _style: { minWidth: "100px" },
              },
              {
                key: "quantity",
                label: "Quantity",
                _props: { className: "text-end", scope: "col" },
                _style: { minWidth: "100px" },
              },
            ]}
            items={delivery_notes}
            loading={loading_get_delivery_note}
            scopedColumns={{
              quantity: (item) => (
                <td>
                  <InputMask
                    className="p-0 text-end"
                    plainText
                    readOnly
                    value={String(item.quantity)}
                  />
                </td>
              ),
            }}
            tableHeadProps={{
              color: "primary",
            }}
            tableProps={{
              bordered: true,
            }}
          />

          {/* Action Button */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
            <Link href="/outbound/delivery-notes">
              <CLoadingButton className="w-100" color="secondary">
                Back
              </CLoadingButton>
            </Link>
          </div>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default DeliveryNoteView;
