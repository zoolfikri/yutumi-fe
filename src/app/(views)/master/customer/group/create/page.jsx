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
  CFormTextarea,
  CInputGroup,
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { InputMaskPhone, ReactSelect } from "@/components/custom-input";
import { Sweetalert, Visible } from "@/components";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { generateCode } from "@/utils";

const PrincipalCreate = () => {
  const router = useRouter();

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingGetProvinces, setLoadingGetProvinces] = useState(false);
  const [loadingGetCities, setLoadingGetCities] = useState(false);
  const [loadingGetDistricts, setLoadingGetDistricts] = useState(false);
  const [loadingPrincipalCode, setLoadingPrincipalCode] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

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

  const getProvinces = useCallback(() => {
    setLoadingGetProvinces(true);
    axios({
      method: "GET",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `/loc/province`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
    }).then(
      (response) => {
        const {
          data: { code, data, message },
        } = response;

        if (parseInt(code) === 200) {
          setProvinces(
            data.map((province) => ({
              value: province.id,
              label: province.province_name,
            }))
          );
        } else {
          Sweetalert.fire({
            title: "Failed",
            text: message,
            icon: "error",
          });
        }

        setLoadingGetProvinces(false);
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

        setLoadingGetProvinces(false);
      }
    );
  }, [user_data.access_token]);

  const getCities = useCallback(
    (prov_id = "") => {
      setLoadingGetCities(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `/loc/city/${prov_id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { code, data, message },
          } = response;

          if (parseInt(code) === 200) {
            setCities(
              data.map((city) => ({
                value: city.id,
                label: city.city_name,
              }))
            );
          } else {
            Sweetalert.fire({
              title: "Failed",
              text: message,
              icon: "error",
            });
          }

          setLoadingGetCities(false);
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

          setLoadingGetCities(false);
        }
      );
    },
    [user_data.access_token]
  );

  const getDistricts = useCallback(
    (city_id = "") => {
      setLoadingGetDistricts(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `loc/district/${city_id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { code, data, message },
          } = response;

          if (parseInt(code) === 200) {
            setDistricts(
              data.map((district) => ({
                value: district.id,
                label: district.district_name,
              }))
            );
          } else {
            Sweetalert.fire({
              title: "Failed",
              text: message,
              icon: "error",
            });
          }

          setLoadingGetDistricts(false);
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

          setLoadingGetDistricts(false);
        }
      );
    },
    [user_data.access_token]
  );

  // Generate Principal Code and set it to the form
  const generatePrincipalCode = useCallback(async () => {
    setLoadingPrincipalCode(true);
    const principal_code = await generateCode("principal");
    setLoadingPrincipalCode(false);
    setValue("principal_code", principal_code);
  }, [setValue]);

  const postPrincipal = (post_data) => {
    setLoadingPost(true);
    axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: "principal/create",
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
            text: "Principal has been created.",
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
    generatePrincipalCode();
    getProvinces();
  }, [generatePrincipalCode, getProvinces]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">Create New Principal</h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                postPrincipal(data);
              },
              (errors) => {
                console.error("invalid", errors);
              }
            )}
          >
            <CRow className="row-cols-1 row-cols-md-2">
              <CCol>
                <div className="mb-3">
                  <CFormLabel htmlFor="principal_code">
                    Principal Code
                  </CFormLabel>
                  <CInputGroup>
                    <CFormInput
                      {...register("principal_code", {
                        required: "Principal Code is required",
                      })}
                      feedback={
                        errors.principal_code && errors.principal_code.message
                      }
                      invalid={errors.principal_code ? true : false}
                      placeholder={
                        getValues("principal_code")
                          ? ""
                          : "Click Generate to get Principal Code"
                      }
                      readOnly
                    />
                    <Visible when={() => !getValues("principal_code")}>
                      <CLoadingButton
                        color="primary"
                        loading={loadingPrincipalCode}
                        onClick={generatePrincipalCode}
                        type="button"
                      >
                        Generate
                      </CLoadingButton>
                    </Visible>
                  </CInputGroup>
                </div>

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
                      <InputMaskPhone
                        feedback={error && error.message}
                        invalid={invalid}
                        onAccept={(value, mask) => onChange(value)}
                        ref={ref}
                        text="e.g., 0812-3456-7890"
                        value={value}
                      />
                    )}
                  />
                </div>

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
                  <CFormLabel htmlFor="country">Country</CFormLabel>
                  <CFormInput
                    {...register("country", {
                      required: "Country is required",
                    })}
                    feedback={errors.country && errors.country.message}
                    invalid={errors.country ? true : false}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="province_id">Province</CFormLabel>
                  <Controller
                    control={control}
                    name="province_id"
                    rules={{
                      required: "Province is required",
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <ReactSelect
                        feedback={error && error.message}
                        invalid={invalid}
                        isLoading={loadingGetProvinces}
                        onChange={(selected) => {
                          onChange(selected.value);
                          // Get cities based on selected province
                          getCities(selected.value);
                          // Reset city and district value
                          setValue("city_id", "");
                          setValue("district_id", "");
                        }}
                        options={provinces}
                        ref={ref}
                        value={provinces.find(
                          (option) => String(option.value) === String(value)
                        )}
                      />
                    )}
                  />
                </div>

                <div className="mb-3">
                  <CFormLabel htmlFor="city_id">City</CFormLabel>
                  <Controller
                    control={control}
                    name="city_id"
                    rules={{
                      required: "City is required",
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                    }) => (
                      <ReactSelect
                        feedback={error && error.message}
                        invalid={invalid}
                        isLoading={loadingGetCities}
                        onChange={(selected) => {
                          onChange(selected.value);
                          // Get districts based on selected city
                          getDistricts(selected.value);
                          // Reset district value
                          setValue("district_id", "");
                        }}
                        options={cities}
                        ref={ref}
                        text="Please select province before selecting city."
                        value={cities.find(
                          (option) => String(option.value) === String(value)
                        )}
                      />
                    )}
                  />
                </div>

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
                        isLoading={loadingGetDistricts}
                        onChange={(selected) => onChange(selected.value)}
                        options={districts}
                        ref={ref}
                        text="Please select city before selecting district."
                        value={districts.find(
                          (option) => String(option.value) === String(value)
                        )}
                      />
                    )}
                  />
                </div>

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
              <Link href="/inbound/principal">
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

export default PrincipalCreate;
