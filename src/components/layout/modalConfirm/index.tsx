import { ModalConfirmContext } from "@/context/modalConfirm";
import { MouseEventHandler, useContext, useRef } from "react";

const ModalConfirm = ({ children }: { children: React.ReactNode }) => {
  const { modalConfirmAlert, setModalConfirmAlert } =
    useContext<any>(ModalConfirmContext);
  const modalRef = useRef(null);
  const close: MouseEventHandler = (e) => {
    if(e.target === modalRef.current){
        setModalConfirmAlert(false);
    }
  }
  return (
    <div
     onClick={close}
      ref={modalRef}
      className={`${
        modalConfirmAlert ? "fixed" : "hidden"
      } fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center`}
    >
      {children}
    </div>
  );
};
export default ModalConfirm;
