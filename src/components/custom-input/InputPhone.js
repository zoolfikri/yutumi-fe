import { IMaskMixin } from "react-imask";
import { CFormInput } from "@coreui/react-pro";

const InputPhone = IMaskMixin(({ inputRef, ...props }) => (
  <CFormInput
    ref={inputRef} // bind internal input
    {...props}
  />
));

export default InputPhone;
