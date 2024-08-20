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
  CFormTextarea,
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { InputPhone, ReactSelect } from "@/components/custom-input";
import { Sweetalert } from "@/components";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

const PrincipalEdit = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");

  const [districts, setDistricts] = useState([]);
  const [loading_get_districts, setLoadingGetDistricts] = useState(false);
  const [loading_put_principal, setLoadingPutPrincipal] = useState(false);
  const [loading_get_principal, setLoadingGetPrincipal] = useState(false);

  const user_data = useSelector((state) => state.user_data);

  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const getDistricts = useCallback((name = "") => {
    setLoadingGetDistricts(true);
    fetch(`https://apitest.coreui.io/demos/users?limit=50&first_name=${name}`)
      .then((response) => response.json())
      .then((result) => {
        setDistricts(
          result.records.map((record) => {
            return {
              value: record.id,
              label: record.first_name,
            };
          })
        );
        setLoadingGetDistricts(false);
      });
  }, []);

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
    [user_data.access_token, router, setError]
  );

  const putPrincipal = (post_data) => {
    setLoadingPutPrincipal(true);
    axios({
      method: "PUT",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `principal/update/${id}`,
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
            text: "Principal has been updated.",
            icon: "success",
          });

          router.push("/inbound/principal");
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingPutPrincipal(false);
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

        setLoadingPutPrincipal(false);
      }
    );
  };

  // Get users data when component mounted
  useEffect(() => {
    getDistricts();
    getPrincipal(id);
  }, [getDistricts, getPrincipal, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Edit Principal</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                putPrincipal(data);
              },
              (errors) => {
                console.log("invalid", errors);
              }
            )}
          >
            <CRow className="row-cols-1 row-cols-md-2">
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="principal_code">
                    Principal Code
                  </CFormLabel>
                  <CFormInput
                    {...register("principal_code", {
                      required: "Principal Code is required",
                    })}
                    feedback={
                      errors.principal_code && errors.principal_code.message
                    }
                    invalid={errors.principal_code ? true : false}
                    text="e.g., PC-001"
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="principal_name">
                    Principal Name
                  </CFormLabel>
                  <CFormInput
                    {...register("principal_name", {
                      required: "Principal Name is required",
                    })}
                    feedback={
                      errors.principal_name && errors.principal_name.message
                    }
                    invalid={errors.principal_name ? true : false}
                    placeholder="Principal Name"
                  />
                </div>
              </CCol>
              <CCol xs={12}>
                <div className="mb-3">
                  <CFormLabel htmlFor="address">Address</CFormLabel>
                  <CFormTextarea
                    {...register("address", {
                      required: "Address is required",
                    })}
                    feedback={errors.address && errors.address.message}
                    invalid={errors.address ? true : false}
                    text="Provide complete address, e.g., Jl. Jend. Sudirman No. 1"
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="district_id">District</CFormLabel>
                  <Controller
                    control={control}
                    name="district_id"
                    rules={{
                      required: "District is required",
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <ReactSelect
                        feedback={error && error.message}
                        invalid={invalid}
                        isLoading={loading_get_districts}
                        onChange={(selected) => onChange(selected.value)}
                        options={districts}
                        ref={ref}
                        text="Please select your District."
                        value={districts.find(
                          (option) => String(option.value) === String(value)
                        )}
                      />
                    )}
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="pos_code">POS Code</CFormLabel>
                  <CFormInput
                    {...register("pos_code", {
                      required: "POS Code is required",
                    })}
                    feedback={errors.pos_code && errors.pos_code.message}
                    invalid={errors.pos_code ? true : false}
                    text="e.g., 12345"
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="country">Country</CFormLabel>
                  <CFormInput
                    {...register("country", {
                      required: "Country is required",
                    })}
                    feedback={errors.country && errors.country.message}
                    invalid={errors.country ? true : false}
                    text="e.g., Indonesia"
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="phone_number">Phone Number</CFormLabel>
                  <Controller
                    control={control}
                    name="phone_number"
                    rules={{
                      required: "Phone Number is required",
                      validate: {
                        isValidPhoneNumber: (value) =>
                          value.match(/^0\d{3}-\d{4}-\d{4}$/) !== null ||
                          "Invalid phone number",
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <InputPhone
                        feedback={error && error.message}
                        invalid={invalid}
                        mask="0000-0000-0000"
                        onAccept={(value, mask) => onChange(value)}
                        ref={ref}
                        text="e.g., 0812-3456-7890"
                        value={value}
                      />
                    )}
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="email">Email</CFormLabel>
                  <CFormInput
                    {...register("email", {
                      required: "Email is required",
                    })}
                    feedback={errors.email && errors.email.message}
                    invalid={errors.email ? true : false}
                    text="Must be a valid email address, e.g., example@email.com"
                  />
                </div>
              </CCol>
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="no_rekening">No Rekening</CFormLabel>
                  <CFormInput
                    {...register("no_rekening", {
                      required: "No Rekening is required",
                    })}
                    invalid={errors.no_rekening ? true : false}
                    feedback={errors.no_rekening && errors.no_rekening.message}
                  />
                </div>
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <CLoadingButton
                color="primary"
                disabled={loading_get_principal}
                loading={loading_put_principal}
                type="submit"
              >
                Save
              </CLoadingButton>
              <Link href="/inbound/principal">
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

export default PrincipalEdit;
