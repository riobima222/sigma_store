import { createContext, useState } from "react";

export const modalContext = createContext({});

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalAppear, setModalAppear]: any = useState(false);
  return (
    <modalContext.Provider value={{ modalAppear, setModalAppear }}>
      {children}
    </modalContext.Provider>
  );
};
export default ModalProvider;
