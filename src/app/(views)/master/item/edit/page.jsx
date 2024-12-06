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
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { Sweetalert } from "@/components";
import {
  InputMaskNumber,
  ReactSelectAsyncPaginate,
} from "@/components/custom-input";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const ItemEdit = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingGetItem, setLoadingGetItem] = useState(false);
  const [principals, setPrincipals] = useState([]);

  const user_data = useSelector((state) => state.user_data);

  const {
    register,
    control,
    setValue,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getPrincipals = useCallback(
    async (search, loadedOptions, { page }) => {
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
    },
    [user_data.access_token]
  );

  const getItem = useCallback(
    (id) => {
      setLoadingGetItem(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `item/detail/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { data },
          } = response;

          setValue("item_code", data.item_code);
          setValue("item_name", data.item_name);
          setValue("principal_id", String(data.principal_id));
          setValue("type", data.type);
          setValue("size", data.size);
          setValue("weight", data.weight);
          setValue("volume", data.volume);
          setValue("unit", data.unit);
          setValue("buy_price", data.buy_price);

          // Get Principal data
          getPrincipals("", [], { page: 1 });

          setLoadingGetItem(false);
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

          setLoadingGetItem(false);
        }
      );
    },
    [setValue, getPrincipals, user_data.access_token]
  );

  const updateItem = (post_data) => {
    setLoadingUpdate(true);
    axios({
      method: "PUT",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `item/update/${id}`,
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

          router.push("/master/item");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingUpdate(false);
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

        setLoadingUpdate(false);
      }
    );
  };

  // Get data when component mounted
  useEffect(() => {
    getItem(id);
  }, [getItem, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Edit Item</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                updateItem(data);
              },
              (errors) => {
                console.log("invalid", errors);
              }
            )}
          >
            <CRow className="row-cols-1 row-cols-md-2">
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="item_code">Item Code</CFormLabel>
                  <CFormInput
                    {...register("item_code", {
                      required: "Item Code is required",
                    })}
                    disabled
                    feedback={errors.item_code && errors.item_code.message}
                    invalid={errors.item_code ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="item_name">Item Name</CFormLabel>
                  <CFormInput
                    {...register("item_name", {
                      required: "Item Name is required",
                    })}
                    disabled={loadingGetItem}
                    feedback={errors.item_name && errors.item_name.message}
                    invalid={errors.item_name ? true : false}
                    placeholder="Item Name"
                  />
                </div>

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
                  <CFormLabel htmlFor="type">Type</CFormLabel>
                  <CFormInput
                    {...register("type", {
                      required: "Type is required",
                    })}
                    feedback={errors.type && errors.type.message}
                    invalid={errors.type ? true : false}
                  />
                </div>
              </CCol>

              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="size">Size</CFormLabel>
                  <CFormInput
                    {...register("size", {
                      required: "Size is required",
                    })}
                    feedback={errors.size && errors.size.message}
                    invalid={errors.size ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="weight">Weight</CFormLabel>
                  <CFormInput
                    {...register("weight", {
                      required: "Weight is required",
                    })}
                    feedback={errors.weight && errors.weight.message}
                    invalid={errors.weight ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="volume">Volume</CFormLabel>
                  <CFormInput
                    {...register("volume", {
                      required: "Volume is required",
                    })}
                    feedback={errors.volume && errors.volume.message}
                    invalid={errors.volume ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="unit">Unit</CFormLabel>
                  <CFormInput
                    {...register("unit", {
                      required: "Unit is required",
                    })}
                    feedback={errors.unit && errors.unit.message}
                    invalid={errors.unit ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="buy_price">Buy Price</CFormLabel>
                  <Controller
                    control={control}
                    name="buy_price"
                    rules={{
                      required: "Buy Price is required",
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <InputMaskNumber
                        feedback={error && error.message}
                        invalid={invalid}
                        onAccept={(value, mask) => onChange(value)}
                        ref={ref}
                        value={String(value)}
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
                loading={loadingUpdate}
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

export default ItemEdit;
