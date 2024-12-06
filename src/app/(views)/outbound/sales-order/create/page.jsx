"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

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
import { InputMask, ReactSelectAsyncPaginate } from "@/components/custom-input";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";

const SOCreate = () => {
  const router = useRouter();

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingGetItems, setLoadingGetItems] = useState(false);
  const [principals, setPrincipals] = useState([]);

  const user_data = useSelector((state) => state.user_data);

  const { register, control, setValue, setError, handleSubmit } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  async function getPrincipals(search, loadedOptions, { page }) {
    const response = await axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `principal/get`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      params: {
        page: page,
        per_page: 10,
        search,
      },
    });

    const {
      data: { data },
    } = response;

    const options = data.map((record) => {
      return {
        value: record.id,
        label: record.principal_name,
      };
    });

    setPrincipals([...loadedOptions, ...options]);

    return {
      options: options,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  }

  const getItemsByPrincipal = (principal_id) => {
    setLoadingGetItems(true);
    axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `principal/get-item/${principal_id}`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
        accept: "application/json",
      },
      params: {
        page: 1,
        per_page: 10,
      },
    }).then(
      (response) => {
        const {
          data: { data },
        } = response;

        const tempItems = data.map((item) => {
          return {
            ...item,
            purchase_request_id: null,
            quantity: 0,
            discount_item: 0,
          };
        });
        setValue("items", tempItems);
        setLoadingGetItems(false);
      },
      (error) => {
        console.log(error);
        setLoadingGetItems(false);
      }
    );
  };

  const postSalesOrder = (post_data) => {
    return axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "pruchase_request/create",
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    });
  };

  const postSOItems = (post_data) => {
    return axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "pruchase_request/add-item",
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    });
  };

  async function createSalesOrder(data) {
    setLoadingPost(true);
    try {
      // Step 1: Send POST request using postSalesOrder function
      const purchaseRequestResponse = await postSalesOrder({
        principal_id: data.principal_id,
        discount_1: data.discount_1,
        discount_2: data.discount_2,
        ppn: data.ppn,
      });

      // Step 2: Save the purchase_request_id returned from postSalesOrder
      const purchaseRequestId = purchaseRequestResponse.data.data;

      // Step 3: Create the next JSON with the purchase_request_id
      const itemsPayload = data.items?.map((item) => ({
        purchase_request_id: purchaseRequestId,
        item_id: item.id,
        quantity: item.quantity,
        discount_item: item.discount_item,
      }));

      // Step 4: Send POST request to create item using postSOItems function
      const prItemsResponse = await postSOItems({ items: itemsPayload });

      // Step 5: Show success message
      const {
        data: { code, message },
      } = prItemsResponse;

      if (parseInt(code) === 201) {
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

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Create New Sales Order</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                createSalesOrder(data);
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

                  <Controller
                    control={control}
                    name="principal_id"
                    rules={{
                      required: "Principal is required",
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <ReactSelectAsyncPaginate
                        additional={{
                          page: 1,
                        }}
                        feedback={error && error.message}
                        invalid={invalid}
                        loadOptions={getPrincipals}
                        onChange={(selected) => {
                          if (
                            value &&
                            String(value) !== String(selected?.value)
                          ) {
                            Sweetalert.fire({
                              title: "Are you sure?",
                              text: "Changing principal will reset the items list.",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, change it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                onChange(String(selected?.value));
                                getItemsByPrincipal(selected?.value);

                                // Reset items
                                setValue("items", []);
                              }
                            });
                          } else if (!value) {
                            onChange(String(selected?.value));
                            getItemsByPrincipal(selected?.value);
                          }
                        }}
                        ref={ref}
                        value={
                          principals.find(
                            (option) => String(option.value) === String(value)
                          )
                            ? {
                                value,
                                label: principals.find(
                                  (option) =>
                                    String(option.value) === String(value)
                                ).label,
                              }
                            : null
                        }
                      />
                    )}
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
                      <Visible when={loadingGetItems}>
                        <div className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </Visible>
                      <Visible when={!loadingGetItems}>
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
              <CLoadingButton
                color="primary"
                loading={loadingPost}
                type="submit"
              >
                Save
              </CLoadingButton>
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

export default SOCreate;
