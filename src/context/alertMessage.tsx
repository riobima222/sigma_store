import { createContext, useState } from "react";

export const AlertMessageContext = createContext({});

const AlertMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [alertMessage, setAlertMessage] = useState("");
  return (
    <AlertMessageContext.Provider value={{ alertMessage, setAlertMessage }}>
      {children}
    </AlertMessageContext.Provider>
  );
};
export default AlertMessageProvider;
