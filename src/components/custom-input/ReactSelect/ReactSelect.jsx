import { CVirtualScroller } from "@coreui/react-pro";
import dynamic from "next/dynamic";
import React, { forwardRef } from "react";
import { components } from "react-select";

const Select = dynamic(() => import("react-select"));
// const Select = dynamic(() => import("react-select"), { ssr: false });

const Menu = (props) => {
  return (
    <>
      {/* <CVirtualScroller visibleItems={100}> */}
      <components.Menu {...props}>{props.children}</components.Menu>
      {/* </CVirtualScroller> */}
    </>
  );
};

const ReactSelect = forwardRef(
  ({ className, feedback, invalid, text, ...props }, ref) => {
    return (
      <>
        <Select
          className={`react-select${className ? ` ${className}` : ""}${
            invalid ? " is-invalid" : ""
          }`}
          classNamePrefix="react-select"
          components={{ Menu }}
          selectRef={ref}
          unstyled={false}
          {...props}
        />
        {text && <div className="form-text">{text}</div>}
        {feedback && <div className="invalid-feedback">{feedback}</div>}
      </>
    );
  }
);

ReactSelect.displayName = "ReactSelect";
export default ReactSelect;
