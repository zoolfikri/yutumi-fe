import { forwardRef } from "react";
import InputMask from "./InputMask";

const InputMaskPhone = forwardRef(({ ...props }, ref) => (
  <InputMask
    {...props}
    inputRef={ref} // bind internal input
    mask="0000-0000-0000"
  />
));

InputMaskPhone.displayName = "InputMaskPhone";
export default InputMaskPhone;
