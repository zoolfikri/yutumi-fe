'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserData } from '@/store/slices/userSlice';

import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CLoadingButton,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilWarning } from '@coreui/icons'

import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

type FormLogin = {
  username: string;
  password: string;
};

const Login = () => {
  const dispatch = useDispatch()

  const router = useRouter()

  const user_data = useSelector((state: any) => state.user_data)

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false)
  const [errorLogin, setErrorLogin] = useState<string>("")

  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors },
  } = useForm<FormLogin>();

  const postLogin = async (data: FormLogin): Promise<any> => {
    try {
      // Convert data to FormData
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      // Send a POST request
      const response = await axios({
        method: 'post',
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: 'auth/login',
        data: formData
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  const onSubmit: SubmitHandler<FormLogin> = (data) => {
    setLoadingLogin(true)
    postLogin(data).then((response) => {
      const { code, access_token, refresh_token, name } = response.data

      if (code === 200) {
        const value = {
          access_token,
          refresh_token,
          name
        }

        dispatch(setUserData(value))

      }
      setLoadingLogin(false)
    }).catch((error) => {
      if (error.response) {
        const { data } = error.response

        setErrorLogin(data.detail)
      } else {
        setErrorLogin("Something went wrong")
      }
      setLoadingLogin(false)
    })
  }

  const onSubmitError = (errors: Object) => {
    console.log(errors)
  }

  // Hook to check if user is already logged in
  useEffect(() => {
    if (user_data.access_token) {
      router.push('/')
    }
  }, [user_data.access_token, router])

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    onSubmit={handleSubmit(
                      onSubmit, onSubmitError
                    )}
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CAlert
                      color="danger"
                      className="d-flex align-items-center" visible={errorLogin ? true : false}
                    >
                      <CIcon
                        icon={cilWarning}
                        className="flex-shrink-0 me-2"
                        width={24}
                        height={24}
                      />
                      {errorLogin}
                    </CAlert>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        {...register("username", {
                          required: "Username cannot be empty",
                          onChange: () => setErrorLogin("")
                        })}
                        placeholder="Username" autoComplete="username"
                        invalid={errors.username ? true : false}
                      />
                      <CFormFeedback invalid={errors.username ? true : false}>
                        {errors.username && errors.username.message}
                      </CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        {...register("password", {
                          required: "Password cannot be empty",
                          onChange: () => setErrorLogin("")
                        })}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        invalid={errors.password ? true : false}
                      />
                      <CFormFeedback invalid={errors.password ? true : false}>
                        {errors.password && errors.password.message}
                      </CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CLoadingButton
                          type='submit'
                          color="primary"
                          className="px-4"
                          loading={loadingLogin}
                          disabledOnLoading
                        >
                          Login
                        </CLoadingButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
