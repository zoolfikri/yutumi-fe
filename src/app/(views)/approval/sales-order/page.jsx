"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CLoadingButton,
  CRow,
  CTable,
} from "@coreui/react-pro";
import { Sweetalert, Visible } from "@/components";

import axios from "axios";
import moment from "moment";

const getBadge = (status) => {
  switch (String(status)) {
    case "Pending":
      return { color: "warning", text: "Waiting for approval" };
    case "Approved":
      return { color: "success", text: "Approved" };
    case "Reject":
      return { color: "danger", text: "Rejected" };
    default:
      return { color: "secondary", text: "-" };
  }
};

const SODetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [loadingGetSalesOrder, setLoadingGetSalesOrder] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [originalSO, setOriginalSO] = useState({});

  const user_data = useSelector((state) => state.user_data);

  const getSalesOrder = useCallback(
    (id) => {
      setLoadingGetSalesOrder(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `so/get-so-detail/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { data },
          } = response;

          setOriginalSO(data);

          setLoadingGetSalesOrder(false);
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

          setLoadingGetSalesOrder(false);
        }
      );
    },
    [user_data.access_token]
  );

  const updateSOStatus = (pr_id, post_data) => {
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `approval/approve-so/${pr_id}`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    }).then(
      (response) => {
        const {
          data: { code, message },
        } = response;

        if (parseInt(code) === 200) {
          Sweetalert.fire({
            title: "Success",
            text: message,
            icon: "success",
          });

          router.push("/approval?tab=2");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingApprove(false);
        setLoadingReject(false);
      },
      (error) => {
        if (error.response) {
          const {
            response: {
              data: { detail },
            },
          } = error;

          if (Array.isArray(detail)) {
            detail.forEach((error) => {
              setError(error.loc[1], {
                type: "custom",
                message: error.msg,
              });
            });
          } else {
            Sweetalert.fire({
              title: "Failed",
              text: detail,
              icon: "error",
            });
          }
        }

        setLoadingApprove(false);
        setLoadingReject(false);
      }
    );
  };

  useEffect(() => {
    getSalesOrder(id);
  }, [getSalesOrder, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Approval - Sales Order</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm>
            <CRow className="g-4 row-cols-1">
              <CCol sm={{ span: "auto", order: 2 }}>
                <h4>
                  <CBadge
                    color={
                      getBadge(originalSO.sales_order?.approval_status).color
                    }
                  >
                    {getBadge(originalSO.sales_order?.approval_status).text}
                  </CBadge>
                </h4>
              </CCol>

              <CCol sm={{ span: true, order: 1 }}>
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="sales_order_code"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Sales Order Code
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="sales_order_code"
                      defaultValue={originalSO.sales_order?.sales_order_code}
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="principal_name"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Principal
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="principal_name"
                      defaultValue={originalSO.sales_order?.principal_name}
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="customer_name"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Customer
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="customer_name"
                      defaultValue={originalSO.sales_order?.customer_name}
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="sales_order_date"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Sales Order Date
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="sales_order_date"
                      defaultValue={
                        originalSO.sales_order?.sales_order_date
                          ? moment(
                              originalSO.sales_order?.sales_order_date
                            ).format("DD MMM YYYY")
                          : ""
                      }
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="exp_date"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Expired Date
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="exp_date"
                      defaultValue={
                        originalSO.sales_order?.exp_date
                          ? moment(originalSO.sales_order?.exp_date).format(
                              "DD MMM YYYY"
                            )
                          : ""
                      }
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="ppn"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    PPN
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="ppn"
                      defaultValue={
                        originalSO.sales_order?.ppn
                          ? `${originalSO.sales_order?.ppn}%`
                          : ""
                      }
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>
              </CCol>

              <CCol xs={{ span: 12, order: 3 }}>
                <Visible
                  when={
                    originalSO.item_detail?.length
                      ? true
                      : false && !loadingGetSalesOrder
                  }
                >
                  <>
                    <h5>Items</h5>
                    <CTable
                      columns={[
                        {
                          key: "no",
                          label: "#",
                          _props: { scope: "col" },
                        },
                        {
                          key: "item_name",
                          label: "Name",
                          _props: { scope: "col" },
                          _style: { width: "100%" },
                        },
                        {
                          key: "quantity",
                          label: "Qty",
                          _props: { scope: "col" },
                          _style: { minWidth: "100px", textAlign: "center" },
                        },
                      ]}
                      hover
                      items={originalSO.item_detail?.map((item, index) => ({
                        ...item,
                        no: index + 1,
                        _cellProps: { quantity: { className: "text-center" } },
                      }))}
                      striped
                    />
                  </>
                </Visible>
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Visible
                when={originalSO.sales_order?.approval_status === "Pending"}
              >
                <CLoadingButton
                  className="text-white"
                  color="success"
                  disabled={!originalSO.sales_order?.id || loadingReject}
                  loading={loadingApprove}
                  onClick={() =>
                    Sweetalert.fire({
                      title: "Are you sure?",
                      text: "You are about to approve this purchase request",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Yes, approve it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setLoadingApprove(true);
                        updateSOStatus(originalSO.sales_order?.id, {
                          approval_value: "Approved",
                        });
                      }
                    })
                  }
                >
                  Approve
                </CLoadingButton>
              </Visible>
              <Visible
                when={originalSO.sales_order?.approval_status === "Pending"}
              >
                <CLoadingButton
                  className="text-white"
                  color="danger"
                  disabled={!originalSO.sales_order?.id || loadingApprove}
                  loading={loadingReject}
                  onClick={() =>
                    Sweetalert.fire({
                      title: "Are you sure?",
                      text: "You are about to reject this purchase request",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#d33",
                      cancelButtonColor: "#3085d6",
                      confirmButtonText: "Yes, reject it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setLoadingReject(true);
                        updateSOStatus(originalSO.sales_order?.id, {
                          approval_value: "Reject",
                        });
                      }
                    })
                  }
                >
                  Reject
                </CLoadingButton>
              </Visible>
              <Link href="/approval?tab=2">
                <CLoadingButton className="w-100" color="secondary">
                  Back
                </CLoadingButton>
              </Link>
            </div>
          </CForm>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default SODetail;
