import { createContext, useState } from "react";

export const ModalUpdateProductContext = createContext({});

const ModalUpdateProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalUpdateProductAppear, setModalUpdateProductAppear] =
    useState(false);

  return (
    <ModalUpdateProductContext.Provider
      value={{ modalUpdateProductAppear, setModalUpdateProductAppear }}
    >
      {children}
    </ModalUpdateProductContext.Provider>
  );
};
export default ModalUpdateProductProvider;
