import React, { forwardRef } from "react";
import { CFormInput, CSmartTable } from "@coreui/react-pro";

import { debounce } from "lodash";
import { useForm } from "react-hook-form";

const CustomizedTable = forwardRef(({ columns, tableProps, ...rest }, ref) => {
  const { register } = useForm();

  const customizedColumns = columns.map((column) => {
    if (
      ((typeof column === "object" || typeof column === "string") &&
        column.filter === undefined) ||
      column.filter === true
    ) {
      return {
        ...(typeof column === "object" ? column : { key: column }),
        filter: (values, onChange) => {
          return (
            <CFormInput
              {...register(column.key ? column.key : column, {
                required: true,
                onChange: debounce((e) => {
                  onChange(e.target.value);
                }, 500),
              })}
            />
          );
        },
      };
    }

    return column;
  });

  return (
    <CSmartTable
      columns={customizedColumns}
      // Set external to true to use the external filter (Like from API), sorter, and pagination
      columnFilter={{
        external: true,
      }}
      columnSorter={{
        external: true,
      }}
      pagination={{
        external: true,
      }}
      ref={ref}
      tableProps={{
        hover: true,
        responsive: true,
        ...(tableProps ? tableProps : {}),
      }}
      {...rest}
    />
  );
});

CustomizedTable.displayName = "CustomizedTable";
export default CustomizedTable;
