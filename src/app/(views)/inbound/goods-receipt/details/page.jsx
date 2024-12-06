"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { Sweetalert, Visible } from "@/components";
import { InputMask } from "@/components/custom-input";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";

const PRDetail = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loadingGetPurchaseRequest, setLoadingGetPurchaseRequest] =
    useState(false);
  const [originalPR, setOriginalPR] = useState({});

  const user_data = useSelector((state) => state.user_data);

  const { register, control, reset } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

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

          const tempData = {
            discount_1: String(data.purchase_request.discount_1),
            discount_2: String(data.purchase_request.discount_2),
            ppn: String(data.purchase_request.ppn),
            items: data.items,
          };
          reset(tempData);
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
    [reset, user_data.access_token]
  );

  useEffect(() => {
    getPurchaseRequest(id);
  }, [getPurchaseRequest, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Create New Purchase Request</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm>
            <CRow className="row-cols-1 row-cols-lg-2">
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="principal_id">Principal</CFormLabel>
                  <CFormInput
                    disabled
                    value={originalPR.purchase_request?.principal_name}
                  />
                </div>

                <div className="mb-3">
                  <Controller
                    control={control}
                    name="discount_1"
                    rules={{
                      required: "Discount is required",
                      min: {
                        value: 0,
                        message: "Minimum value is 0",
                      },
                      max: {
                        value: 100,
                        message: "Maximum value is 100",
                      },
                    }}
                    render={({
                      field: { name, onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <>
                        <CFormLabel htmlFor={name}>Discount 1</CFormLabel>
                        <CInputGroup className="has-validation">
                          <InputMask
                            aria-describedby={`addon-${name}`}
                            disabled
                            feedback={error && error.message}
                            inputRef={ref}
                            invalid={invalid}
                            mask="000"
                            onAccept={(value, mask) => onChange(value)}
                            value={value}
                          />
                          <CInputGroupText id={`addon-${name}`}>
                            %
                          </CInputGroupText>
                        </CInputGroup>
                      </>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <Controller
                    control={control}
                    name="discount_2"
                    rules={{
                      required: "Discount is required",
                      min: {
                        value: 0,
                        message: "Minimum value is 0",
                      },
                      max: {
                        value: 100,
                        message: "Maximum value is 100",
                      },
                    }}
                    render={({
                      field: { name, onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <>
                        <CFormLabel htmlFor={name}>Discount 2</CFormLabel>
                        <CInputGroup className="has-validation">
                          <InputMask
                            aria-describedby={`addon-${name}`}
                            disabled
                            feedback={error && error.message}
                            inputRef={ref}
                            invalid={invalid}
                            mask="000"
                            onAccept={(value, mask) => onChange(value)}
                            value={value}
                          />
                          <CInputGroupText id={`addon-${name}`}>
                            %
                          </CInputGroupText>
                        </CInputGroup>
                      </>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <Controller
                    control={control}
                    name="ppn"
                    rules={{
                      required: "PPN is required",
                      min: {
                        value: 0,
                        message: "Minimum value is 0",
                      },
                      max: {
                        value: 100,
                        message: "Maximum value is 100",
                      },
                    }}
                    render={({
                      field: { name, onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <>
                        <CFormLabel htmlFor={name}>PPN</CFormLabel>
                        <CInputGroup className="has-validation">
                          <InputMask
                            aria-describedby={`addon-${name}`}
                            disabled
                            feedback={error && error.message}
                            inputRef={ref}
                            invalid={invalid}
                            mask="000"
                            onAccept={(value, mask) => onChange(value)}
                            value={value}
                          />
                          <CInputGroupText id={`addon-${name}`}>
                            %
                          </CInputGroupText>
                        </CInputGroup>
                      </>
                    )}
                  />
                </div>
              </CCol>

              <CCol>
                <Visible when={fields.length ? true : false}>
                  <CCard color="light">
                    <CCardHeader>
                      <h5 className="mb-0">Items</h5>
                    </CCardHeader>
                    <CCardBody>
                      <Visible when={!loadingGetPurchaseRequest}>
                        <>
                          {fields.map((item, index) => (
                            <div key={index}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  className="col-sm-8 col-form-label"
                                  htmlFor={`items.${index}.quantity`}
                                >
                                  {item.item_name}
                                </CFormLabel>

                                <CCol sm>
                                  <CInputGroup className="mb-3">
                                    <CInputGroupText
                                      id={`addon-items.${index}.quantity`}
                                    >
                                      Qty
                                    </CInputGroupText>
                                    <CFormInput
                                      aria-describedby={`addon-items.${index}.quantity`}
                                      className="text-end"
                                      disabled
                                      id={`items.${index}.quantity`}
                                      placeholder="Quantity"
                                      {...register(`items.${index}.quantity`)}
                                    />
                                  </CInputGroup>
                                </CCol>
                              </CRow>
                            </div>
                          ))}
                        </>
                      </Visible>
                    </CCardBody>
                  </CCard>
                </Visible>
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Link href="/inbound/purchase-request">
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
