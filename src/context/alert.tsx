import { createContext, useState } from "react";

export const AlertContext = createContext({});

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState(false);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
export default AlertProvider;
