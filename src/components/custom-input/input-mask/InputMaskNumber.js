import { forwardRef } from "react";
import InputMask from "./InputMask";

const InputMaskNumber = forwardRef(({ ...props }, ref) => (
  <InputMask
    {...props}
    inputRef={ref} // bind internal input
    mask={Number}
    thousandsSeparator="."
    // commaSeparator=","
  />
));

InputMaskNumber.displayName = "InputMaskNumber";
export default InputMaskNumber;
