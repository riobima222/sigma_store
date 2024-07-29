import { createContext, useState } from "react";

export const CartFinishContext = createContext({});

const CartFinishProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartFinish, setCartFinish] = useState<any>([]);

  return (
    <CartFinishContext.Provider value={{ cartFinish, setCartFinish }}>
      {children}
    </CartFinishContext.Provider>
  );
};
export default CartFinishProvider;
