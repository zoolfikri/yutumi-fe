"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

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
import { InputMaskPhone } from "@/components/custom-input";
import { Sweetalert } from "@/components";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

const PrincipalView = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loading_get_principal, setLoadingGetPrincipal] = useState(false);

  const user_data = useSelector((state) => state.user_data);

  const { register, control, reset, setError } = useForm();

  const getPrincipal = useCallback(
    (id) => {
      setLoadingGetPrincipal(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `principal/detail${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { code, data, message },
          } = response;

          if (parseInt(code) === 200) {
            reset(data);
          } else {
            Sweetalert.fire({
              title: "Failed",
              text: message,
              icon: "error",
            });
          }

          setLoadingGetPrincipal(false);
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

          setLoadingGetPrincipal(false);
        }
      );
    },
    [user_data.access_token, reset, setError]
  );

  // Get users data when component mounted
  useEffect(() => {
    getPrincipal(id);
  }, [getPrincipal, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Principal Detail</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Principal Code
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  {...register("principal_code")}
                  plainText
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Principal Name
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  {...register("principal_name")}
                  plainText
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Phone Number
              </CFormLabel>
              <CCol sm={10}>
                <Controller
                  control={control}
                  name="phone_number"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) => (
                    <InputMaskPhone
                      plainText
                      readOnly
                      ref={ref}
                      value={value}
                    />
                  )}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Email</CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("email")} plainText readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                No Rekening
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("no_rekening")} plainText readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Country
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("country")} plainText readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                District
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("district_id")} plainText readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                Address
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("address")} plainText readOnly />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">
                POS Code
              </CFormLabel>
              <CCol sm={10}>
                <CFormInput {...register("pos_code")} plainText readOnly />
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <Link href="/inbound/principal">
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

export default PrincipalView;
