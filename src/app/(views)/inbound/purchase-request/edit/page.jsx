"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

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

const PREdit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingGetPurchaseRequest, setLoadingGetPurchaseRequest] =
    useState(false);
  const [originalPR, setOriginalPR] = useState({});

  const user_data = useSelector((state) => state.user_data);

  const { register, control, reset, watch, setError, handleSubmit } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "items",
  });
  const watchedForm = watch();

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

  const postPurchaseRequest = (id, post_data) => {
    return axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `pruchase_request/update/${id}`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    });
  };

  const postPRItems = (pr_item_id, post_data) => {
    return axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `pruchase_request/update-pr-item/${pr_item_id}`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    });
  };

  async function updatePurchaseRequest(data) {
    setLoadingPost(true);
    try {
      // Step 1: Send POST request using postPurchaseRequest function
      const purchaseRequestResponse = await postPurchaseRequest(id, {
        principal_id: data.principal_id,
        discount_1: data.discount_1,
        discount_2: data.discount_2,
        ppn: data.ppn,
      });

      // Step 2: Get the updated fields
      const updatedFields = [...watchedForm["items"]]
        .map((field) => {
          const originalItem = originalPR.items.find(
            (item) => item.pr_item_id === field.pr_item_id
          );
          console.log("originalItem", originalItem);
          if (
            originalItem &&
            String(originalItem.quantity) !== String(field.quantity)
          ) {
            return {
              ...field,
              quantity: field.quantity, // Keep the new quantity
            };
          }
          return null; // Return null if quantity hasn't changed
        })
        .filter((item) => item !== null); // Filter out null values

      // Step 3: Send POST request for each updated field if there are any
      if (updatedFields.length > 0) {
        const postPRItemsPromises = updatedFields.map((field) =>
          postPRItems(field.pr_item_id, {
            purchase_request_id: id,
            item_id: field.item_id,
            quantity: field.quantity,
            discount_item: field.discount_item,
          })
        );
        const prItemsResponse = await Promise.all(postPRItemsPromises);

        // Step 4: Show success message for updated items
        const {
          data: { code, message },
        } = prItemsResponse[0]; // Assuming all responses have the same structure

        if (parseInt(code) === 200) {
          Sweetalert.fire({
            title: "Success",
            text: message,
            icon: "success",
          });

          router.push("/inbound/purchase-request");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }
      } else {
        // Step 4: Show success message even if no items were updated
        const {
          data: { code, message },
        } = purchaseRequestResponse;

        if (parseInt(code) === 200) {
          Sweetalert.fire({
            title: "Success",
            text: "Purchase request updated successfully. No items were changed.",
            icon: "success",
          });

          router.push("/inbound/purchase-request");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }
      }

      setLoadingPost(false);
    } catch (error) {
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

      setLoadingPost(false);
    }
  }

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
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                updatePurchaseRequest({
                  ...data,
                  principal_id: originalPR.purchase_request?.principal_id,
                });
              },
              (errors) => {
                console.log("invalid", errors);
              }
            )}
          >
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

                                <CFormLabel className="col-sm-auto col-form-label text-muted">
                                  Qty
                                </CFormLabel>

                                <CCol sm>
                                  <CFormInput
                                    className="text-end"
                                    id={`items.${index}.quantity`}
                                    placeholder="Quantity"
                                    {...register(`items.${index}.quantity`)}
                                  />
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
              <Visible
                when={
                  originalPR.purchase_request?.approval_status &&
                  originalPR.purchase_request?.approval_status === "Pending"
                    ? true
                    : false
                }
              >
                <CLoadingButton
                  color="primary"
                  disabled={loadingGetPurchaseRequest}
                  loading={loadingPost}
                  type="submit"
                >
                  Save
                </CLoadingButton>
              </Visible>
              <Link href="/inbound/purchase-request">
                <CLoadingButton className="w-100" color="secondary">
                  Cancel
                </CLoadingButton>
              </Link>
            </div>
          </CForm>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default PREdit;
