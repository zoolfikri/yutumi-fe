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
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { Sweetalert } from "@/components";
import { InputMaskNumber } from "@/components/custom-input";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const ItemEdit = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loadingGetItem, setLoadingGetItem] = useState(false);
  const [principals, setPrincipals] = useState([]);

  const user_data = useSelector((state) => state.user_data);

  const {
    register,
    control,
    setValue,

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

  // Get data when component mounted
  useEffect(() => {
    getItem(id);
  }, [getItem, id]);

  if (loadingGetItem) {
    console.log("Loading...");
  }

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Item Detail</h4>
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
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Item Code
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("item_code")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Item Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("item_name")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Principal
              </CFormLabel>
              <CCol sm={10}>
                <Controller
                  control={control}
                  name="principal_id"
                  render={({ field }) => (
                    <>
                      <CFormInput
                        {...field}
                        plainText
                        readOnly
                        value={
                          principals.find(
                            (option) =>
                              String(option.value) === String(field.value)
                          )
                            ? principals.find(
                                (option) =>
                                  String(option.value) === String(field.value)
                              ).label
                            : null
                        }
                      />
                    </>
                  )}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Type</CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("type")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Size</CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("size")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Weight
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("weight")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Volume
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("volume")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Unit</CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("unit")} plainText readOnly />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Buy Price
              </CFormLabel>
              <CCol sm={10}>
                <Controller
                  control={control}
                  name="buy_price"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <InputMaskNumber plainText readOnly value={String(value)} />
                  )}
                />
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Link href="/master/item">
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

export default ItemEdit;
