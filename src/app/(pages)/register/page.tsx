"use client";

import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

type InputRegister = {
  name: string;
  nik: string;
  username: string;
  password: string;
  re_password: string;
  email: string;
  role_id: number;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InputRegister>();

  const postRegister = async (data: InputRegister) => {
    try {
      // Send a POST request
      const response = await axios({
        method: 'post',
        url: '/user/12345',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  const onSubmit: SubmitHandler<InputRegister> = (data) => {
    postRegister(data)
  }

  const onSubmitError = (errors: Object) => {
    console.log(errors)
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm
                  onSubmit={handleSubmit(
                    onSubmit, onSubmitError
                  )}
                >
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      {...register("username", {
                        required: "Username cannot be empty"
                      })}
                      placeholder="Username"
                      autoComplete="username"
                      invalid={errors.username ? true : false}
                    />
                    <CFormFeedback invalid={errors.username ? true : false}>
                      {errors.username && errors.username.message}
                    </CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      {...register("email", {
                        required: "Email cannot be empty",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email address"
                        }
                      })}
                      placeholder="Email"
                      autoComplete="email"
                      invalid={errors.email ? true : false}
                    />
                    <CFormFeedback invalid={errors.email ? true : false}>
                      {errors.email && errors.email.message}
                    </CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      {...register("password", {
                        required: "Password cannot be empty",
                        minLength: {
                          value: 6,
                          message: "Password must have at least 6 characters"
                        },
                        maxLength: {
                          value: 20,
                          message: "Password must have at most 20 characters"
                        },
                        validate: (value) =>
                          value !== watch("username") || "Password must be different from username",
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                          message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                        }
                      })}
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      invalid={errors.password ? true : false}
                    />
                    <CFormFeedback invalid={errors.password ? true : false}>
                      {errors.password && errors.password.message}
                    </CFormFeedback>
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      {...register("re_password", {
                        required: "Repeat password cannot be empty",
                        validate: (value) =>
                          value === watch("password") || "The passwords do not match"
                      })}
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      invalid={errors.re_password ? true : false}
                    />
                    <CFormFeedback invalid={errors.re_password ? true : false}>
                      {errors.re_password && errors.re_password.message}
                    </CFormFeedback>
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
