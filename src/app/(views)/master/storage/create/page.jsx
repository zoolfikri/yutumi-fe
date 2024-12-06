"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { Sweetalert, Visible } from "@/components";
import { ReactSelectAsyncPaginate } from "@/components/custom-input";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { generateCode } from "@/utils";

const StorageCreate = () => {
  const router = useRouter();

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingStorageCode, setLoadingStorageCode] = useState(false);
  const [principals, setPrincipals] = useState([]);
  const [items, setItems] = useState([]);

  const user_data = useSelector((state) => state.user_data);

  const {
    register,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // Generate Principal Code and set it to the form
  const generateStorageCode = useCallback(async () => {
    setLoadingStorageCode(true);
    const storage_code = await generateCode("storage");
    setLoadingStorageCode(false);
    setValue("storage_code", storage_code);
  }, [setValue]);

  async function getTypes(search, loadedOptions, { page }) {
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
        // value: record.id,
        value: "1",
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

  async function getItems(search, loadedOptions, { page }) {
    const response = await axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `item/get`,
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
        label: record.item_name,
      };
    });

    setItems([...loadedOptions, ...options]);

    return {
      options: options,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  }

  const postStorage = (post_data) => {
    setLoadingPost(true);
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "storage_master/create",
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    }).then(
      (response) => {
        const {
          data: { code, message },
        } = response;

        if (parseInt(code) === 201) {
          Sweetalert.fire({
            title: "Success",
            text: message || "Storage has been created.",
            icon: "success",
          });

          router.push("/master/storage");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingPost(false);
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

        setLoadingPost(false);
      }
    );
  };

  // Get users data when component mounted
  useEffect(() => {
    generateStorageCode();
  }, [generateStorageCode]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Create New Storage</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                postStorage(data);
              },
              (errors) => {
                console.log("invalid", errors);
              }
            )}
          >
            <CRow className="row-cols-1 row-cols-md-2">
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="storage_code">Storage Code</CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      {...register("storage_code", {
                        required: "Principal Code is required",
                      })}
                      feedback={
                        errors.storage_code && errors.storage_code.message
                      }
                      invalid={errors.storage_code ? true : false}
                      placeholder={
                        getValues("storage_code")
                          ? ""
                          : "Click Generate to get Storage Code"
                      }
                      readOnly
                    />
                    <Visible when={() => !getValues("storage_code")}>
                      <CLoadingButton
                        color="primary"
                        loading={loadingStorageCode}
                        onClick={generateStorageCode}
                        type="button"
                      >
                        Generate
                      </CLoadingButton>
                    </Visible>
                  </CInputGroup>
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="storage_name">Storage Name</CFormLabel>
                  <CFormInput
                    {...register("storage_name", {
                      required: "Storage Name is required",
                    })}
                    feedback={
                      errors.storage_name && errors.storage_name.message
                    }
                    invalid={errors.storage_name ? true : false}
                    placeholder="Storage Name"
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="storage_type">Storage Type</CFormLabel>

                  <Controller
                    control={control}
                    name="storage_type"
                    rules={{
                      required: "Storage Type is required",
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
                        loadOptions={getTypes}
                        onChange={(selected) => {
                          onChange(String(selected?.value));
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
                  <CFormLabel htmlFor="item_id">Item</CFormLabel>

                  <Controller
                    control={control}
                    name="item_id"
                    rules={{
                      required: "Item Type is required",
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
                        loadOptions={getItems}
                        onChange={(selected) => {
                          onChange(String(selected?.value));
                        }}
                        ref={ref}
                        value={
                          items.find(
                            (option) => String(option.value) === String(value)
                          )
                            ? {
                                value,
                                label: items.find(
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
              <Link href="/master/item">
                <CLoadingButton className="w-100" color="secondary">
                  Cancel
                </CLoadingButton>
              </Link>
              <CLoadingButton
                color="secondary"
                className="mt-3 d-none"
                onClick={() => {
                  Sweetalert.fire({
                    title: "Do you want to save the changes?",
                    text: "You won't be able to revert this!",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`,
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      Sweetalert.fire("Saved!", "", "success");
                    } else if (result.isDenied) {
                      Sweetalert.fire("Changes are not saved", "", "info");
                    }
                  });
                }}
              >
                ADG
              </CLoadingButton>
            </div>
          </CForm>
        </CContainer>
      </CCardBody>
    </CCard>
  );
};

export default StorageCreate;
