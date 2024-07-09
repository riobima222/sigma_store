import { modalContext } from "@/context/modalAppears";
import React, { MouseEventHandler, useContext, useRef } from "react";

const Modal = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) => {
  const { setModalAppear }: any = useContext(modalContext);
  const modalRef = useRef(null);
  const Close: MouseEventHandler = (e) => {
    if (e.target === modalRef.current) {
      setModalAppear(false);
    }
  };
  return (
    <div
      onClick={Close}
      ref={modalRef}
      className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center px-5"
    >
      <div className={`bg-white ${className} w-full p-4`}>{children}</div>
    </div>
  );
};
export default Modal;
