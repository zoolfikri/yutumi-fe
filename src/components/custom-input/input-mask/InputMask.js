import { IMaskMixin } from "react-imask";
import { CFormInput } from "@coreui/react-pro";

const InputMask = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput
    {...props}
    ref={inputRef} // bind internal input
  />
));

export default InputMask;
