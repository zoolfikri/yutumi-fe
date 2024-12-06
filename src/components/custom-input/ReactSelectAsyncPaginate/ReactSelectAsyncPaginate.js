import { forwardRef } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import classNames from "classnames";

const ReactSelectAsyncPaginate = forwardRef(
  ({ className, feedback, invalid, text, id, ...props }, ref) => {
    // const generatedId = id || `react-select-${Math.random().toString(36)}`;
    return (
      <>
        <AsyncPaginate
          // id={generatedId}
          className={classNames(
            "react-select",
            className,
            invalid ? " is-invalid" : ""
          )}
          classNamePrefix="react-select"
          selectRef={ref}
          {...props}
        />
        {text && <div className="form-text">{text}</div>}
        {feedback && <div className="invalid-feedback">{feedback}</div>}
      </>
    );
  }
);

ReactSelectAsyncPaginate.displayName = "ReactSelectAsyncPaginate";
export default ReactSelectAsyncPaginate;
