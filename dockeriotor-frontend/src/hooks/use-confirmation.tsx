import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function useConfirmation({ onConfirm }: any) {
  const confirmationSwal = () => {
    return withReactContent(Swal)
      .fire({
        title: <span className="text-white">Are you sure?</span>,
        html: (
          <span className="text-white">You won't be able to revert this!</span>
        ),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "red",
        focusConfirm: false,
        cancelButtonColor: "#202020",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        background: "#101010",
      })
      .then((result) => {
        if (result.isConfirmed) {
          onConfirm();
        }
      });
  };

  return confirmationSwal;
}
