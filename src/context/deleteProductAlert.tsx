import { createContext, useState } from "react";

export const DeleteProductAlertContext = createContext({});

const DeleteProductAlertProvider = ({children}: {children: React.ReactNode}) => {
    const [deleteProductAlert, setDeleteProductAlert] = useState(false);

    return (
        <DeleteProductAlertContext.Provider value={{deleteProductAlert, setDeleteProductAlert}}>
            {children}
        </DeleteProductAlertContext.Provider>
    )
}

export default DeleteProductAlertProvider;