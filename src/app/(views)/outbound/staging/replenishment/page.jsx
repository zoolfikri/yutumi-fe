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
  CFormLabel,
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { Sweetalert } from "@/components";
import { ReactSelectAsyncPaginate } from "@/components/custom-input";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const ReplenishmentCreate = () => {
  const router = useRouter();

  const [loadingPost, setLoadingPost] = useState(false);

  const user_data = useSelector((state) => state.user_data);

  const { control, handleSubmit } = useForm();

  async function getStagings(search, loadedOptions, { page }) {
    try {
      const response = await axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `staging/get`,
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
        data: {
          data: { page: resultPage, result, total_page },
        },
      } = response;

      const options = result.map((record) => {
        return {
          value: record.id,
          label: record.storage_name,
        };
      });

      return {
        options: options,
        hasMore: resultPage < total_page,
        additional: {
          page: resultPage + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page: page,
        },
      };
    }
  }

  async function getPickingAreas(search, loadedOptions, { page }) {
    const response = await axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `inventory/get_picking_area`,
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
        label: record.storage_name,
      };
    });

    return {
      options: options,
      hasMore: false,
      additional: {
        page: page + 1,
      },
    };
  }

  const postReplenishment = (post_data) => {
    setLoadingPost(true);
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "inventory/replanishment",
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
            text: message || "Replenishment has been created.",
            icon: "success",
          });

          router.push("/outbound/staging");
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

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Add Replenishment</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                postReplenishment({
                  picking_area_id: data.picking_area?.value,
                  inventory_id: data.staging?.value,
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
                  <CFormLabel htmlFor="staging">Staging</CFormLabel>

                  <Controller
                    control={control}
                    name="staging"
                    rules={{
                      required: "Staging is required",
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
                        loadOptions={getStagings}
                        onChange={(selected) => onChange(selected)}
                        ref={ref}
                        value={value}
                      />
                    )}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="picking_area">Picking Area</CFormLabel>

                  <Controller
                    control={control}
                    name="picking_area"
                    rules={{
                      required: "Picking Area is required",
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
                        loadOptions={getPickingAreas}
                        onChange={(selected) => onChange(selected)}
                        ref={ref}
                        value={value}
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
              <Link href="/outbound/staging">
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

export default ReplenishmentCreate;
