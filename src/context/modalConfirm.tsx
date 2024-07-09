import { createContext, useState } from "react";

export const ModalConfirmContext = createContext({});

const ModalConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalConfirmAlert, setModalConfirmAlert] = useState(false);

  return (
    <ModalConfirmContext.Provider
      value={{ modalConfirmAlert, setModalConfirmAlert }}
    >
      {children}
    </ModalConfirmContext.Provider>
  );
};
export default ModalConfirmProvider;
