import Swal from "sweetalert2";

const Sweetalert = Swal.mixin({
  customClass: {
    // container: "...",
    popup: "rounded-2 p-3",
    // header: "...",
    // title: "...",
    // closeButton: "...",
    // icon: "...",
    // image: "...",
    // htmlContainer: "...",
    // input: "...",
    // inputLabel: "...",
    // validationMessage: "...",
    actions: "d-flex justify-content-center w-100",
    confirmButton: "btn btn-success text-white flex-grow-1 mx-1",
    denyButton: "btn btn-outline-danger flex-grow-1 mx-1",
    cancelButton: "btn btn-secondary flex-grow-1 mx-1",
    // loader: "...",
    // footer: "....",
    // timerProgressBar: "....",
  },
  buttonsStyling: false,
});

export default Sweetalert;
