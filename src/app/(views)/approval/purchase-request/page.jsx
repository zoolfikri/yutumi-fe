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

const PRDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [loadingGetPurchaseRequest, setLoadingGetPurchaseRequest] =
    useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [originalPR, setOriginalPR] = useState({});

  const user_data = useSelector((state) => state.user_data);

  const getPurchaseRequest = useCallback(
    (id) => {
      setLoadingGetPurchaseRequest(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `pruchase_request/get-pr-detail/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { data },
          } = response;

          setOriginalPR(data);

          setLoadingGetPurchaseRequest(false);
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

          setLoadingGetPurchaseRequest(false);
        }
      );
    },
    [user_data.access_token]
  );

  const updatePRStatus = (pr_id, post_data) => {
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `approval/approve-pr/${pr_id}`,
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
    getPurchaseRequest(id);
  }, [getPurchaseRequest, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Approval - Purchase Request</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm>
            <CRow className="g-4 row-cols-1">
              <CCol sm={{ span: "auto", order: 2 }}>
                <h4>
                  <CBadge
                    color={
                      getBadge(originalPR.purchase_request?.approval_status)
                        .color
                    }
                  >
                    {
                      getBadge(originalPR.purchase_request?.approval_status)
                        .text
                    }
                  </CBadge>
                </h4>
              </CCol>

              <CCol sm={{ span: true, order: 1 }}>
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
                      defaultValue={originalPR.purchase_request?.principal_name}
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="discount_1"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Discount 1
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="discount_1"
                      defaultValue={
                        originalPR.purchase_request?.discount_1
                          ? `${originalPR.purchase_request?.discount_1}%`
                          : ""
                      }
                      readOnly
                      plainText
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor="discount_2"
                    className="col-5 col-lg-4 col-xl-2 col-form-label"
                  >
                    Discount 2
                  </CFormLabel>
                  <CCol xs={1} className="align-self-center">
                    :
                  </CCol>
                  <CCol xs={6} lg={7} xl={9}>
                    <CFormInput
                      type="text"
                      id="discount_2"
                      defaultValue={
                        originalPR.purchase_request?.discount_2
                          ? `${originalPR.purchase_request?.discount_2}%`
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
                        originalPR.purchase_request?.ppn
                          ? `${originalPR.purchase_request?.ppn}%`
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
                    originalPR.items?.length
                      ? true
                      : false && !loadingGetPurchaseRequest
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
                      items={originalPR.items?.map((item, index) => ({
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
                when={
                  originalPR.purchase_request?.approval_status === "Pending"
                }
              >
                <CLoadingButton
                  className="text-white"
                  color="success"
                  disabled={!originalPR.purchase_request?.id || loadingReject}
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
                        updatePRStatus(originalPR.purchase_request?.id, {
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
                when={
                  originalPR.purchase_request?.approval_status === "Pending"
                }
              >
                <CLoadingButton
                  className="text-white"
                  color="danger"
                  disabled={!originalPR.purchase_request?.id || loadingApprove}
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
                        updatePRStatus(originalPR.purchase_request?.id, {
                          approval_value: "Reject",
                        });
                      }
                    })
                  }
                >
                  Reject
                </CLoadingButton>
              </Visible>
              <Link href="/approval">
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

export default PRDetail;
