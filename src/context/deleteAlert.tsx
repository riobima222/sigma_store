import { useState, createContext } from "react";

export const DeleteAlertContext = createContext({});

const DeleteAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [deleteAlert, setDeleteAlert] = useState(false);
  return (
    <DeleteAlertContext.Provider value={{ deleteAlert, setDeleteAlert }}>
      {children}
    </DeleteAlertContext.Provider>
  );
};

export default DeleteAlertProvider;
