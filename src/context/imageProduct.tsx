import { createContext, useState } from "react";

export const imageProductContext = createContext({})

const ImageProductProvider = ({children}: any) => {
    const [image, setImage]: any = useState(null)
    return (
        <imageProductContext.Provider value={{image, setImage}}>
            {children}
        </imageProductContext.Provider>
    )
}
export default ImageProductProvider