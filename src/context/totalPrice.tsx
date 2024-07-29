import { createContext, useState } from "react";

export const TotalPriceContext = createContext({});

const TotalPriceProvider = ({children}: {children: React.ReactNode}) => {
    const [totalPrice, setTotalPrice] = useState(0);

    return (
        <TotalPriceContext.Provider value={{totalPrice, setTotalPrice}}>
            {children}
        </TotalPriceContext.Provider>
    )
}

export default TotalPriceProvider;