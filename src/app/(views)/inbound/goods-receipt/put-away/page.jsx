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
  CLoadingButton,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react-pro";
import { Sweetalert, Visible } from "@/components";
import SelectStorage from "./../components/SelectStorage";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";

const PutAwayEdit = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  const [loadingPost, setLoadingPost] = useState(false);
  const [loadingGetPutAway, setLoadingGetPutAway] = useState(false);
  const [originalPutAway, setOriginalPutAway] = useState({});

  const user_data = useSelector((state) => state.user_data);

  const { control, reset, watch, setError, handleSubmit } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const getPutAway = useCallback(
    (id) => {
      setLoadingGetPutAway(true);
      axios({
        method: "GET",
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        url: `goods_receipt/get-gr-detail/${id}`,
        headers: {
          Authorization: `Bearer ${user_data.access_token}`,
        },
      }).then(
        (response) => {
          const {
            data: { data },
          } = response;

          reset(data);
          setOriginalPutAway(data);

          setLoadingGetPutAway(false);
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

          setLoadingGetPutAway(false);
        }
      );
    },
    [reset, user_data.access_token]
  );

  const postPutAwayItems = (post_data) => {
    return axios({
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      url: `inventory/put_away`,
      headers: {
        Authorization: `Bearer ${user_data.access_token}`,
      },
      data: post_data,
    });
  };

  async function updatePutAway(data) {
    setLoadingPost(true);
    try {
      //  Step 1: create data payload for put away
      const putAwayItems = data.items.map((item) => {
        return {
          id: item.id,
          storage_master_id: item.storage_master?.value,
        };
      });

      // Step 2: create promise for put away items
      const putAwayItemsPromises = putAwayItems.map((item) => {
        return postPutAwayItems({
          storage_master_id: item.storage_master_id,
          goods_receipt_item_id: item.id,
        });
      });

      // Step 3: post put away items
      const postPutAwayItemsResponse = await Promise.all(putAwayItemsPromises);

      // Step 4: Show success message for updated items
      const {
        data: { code, message },
      } = postPutAwayItemsResponse[0]; // Assuming all responses have the same structure

      if (parseInt(code) === 200) {
        Sweetalert.fire({
          title: "Success",
          text: message,
          icon: "success",
        });

        router.push("/inbound/goods-receipt");
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

  useEffect(() => {
    getPutAway(id);
  }, [getPutAway, id]);

  return (
    <CCard>
      <CCardHeader>
        <h4 className="mb-0">
          Put Away {originalPutAway.goods_receipt?.goods_receipt_code}
        </h4>
      </CCardHeader>
      <CCardBody>
        <CContainer>
          <CForm
            onSubmit={handleSubmit(
              (data) => {
                Sweetalert.fire({
                  title: "Are you sure?",
                  html: `Please take a moment to carefully review and verify that all your data is <span class="text-success">accurate</span> and free of any <span class="text-danger">discrepancies</span>.`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                  cancelButtonText: "No",
                }).then((result) => {
                  if (result.isConfirmed) {
                    updatePutAway(data);
                  }
                });
              },
              (errors) => {
                console.log("invalid", errors);
              }
            )}
          >
            <CRow>
              <CCol>
                <Visible when={fields.length ? true : false}>
                  <Visible when={!loadingGetPutAway}>
                    <CTable>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">#</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Item Name
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Principal
                          </CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Inventory
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {fields.map((item, index) => (
                          <CTableRow key={item.id}>
                            <CTableHeaderCell scope="row">
                              {index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{item.item_name}</CTableDataCell>
                            <CTableDataCell>{item.principal_id}</CTableDataCell>
                            <CTableDataCell>{item.principal_id}</CTableDataCell>
                            <CTableDataCell>
                              <Controller
                                control={control}
                                name={`items.${index}.storage_master`}
                                rules={{
                                  required: "Storage is required",
                                }}
                                render={({
                                  field: { onChange, onBlur, value, ref },
                                  fieldState: {
                                    invalid,
                                    isTouched,
                                    isDirty,
                                    error,
                                  },
                                }) => (
                                  <SelectStorage
                                    feedback={error && error.message}
                                    invalid={invalid}
                                    onChange={(selected) => {
                                      onChange(selected);
                                    }}
                                    ref={ref}
                                    value={value}
                                  />
                                )}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </Visible>
                </Visible>
              </CCol>
            </CRow>

            {/* Action Button */}
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
              <CLoadingButton
                color="primary"
                disabled={loadingGetPutAway}
                loading={loadingPost}
                type="submit"
              >
                Save
              </CLoadingButton>
              <Link href="/inbound/goods-receipt">
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

export default PutAwayEdit;
