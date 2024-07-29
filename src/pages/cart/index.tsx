import { cartServices, productsServices } from "@/services/auth";
import { convertPrice } from "@/utils/convertPrice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Fragment, useContext, useEffect, useState } from "react";
import Alert from "../../components/alert";

// Icons
import { FaRegTrashCan } from "react-icons/fa6";
import { TiTickOutline } from "react-icons/ti";
import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import Link from "next/link";
import { CartFinishContext } from "@/context/cartFinish";
import { TotalPriceContext } from "@/context/totalPrice";

const CartPage = () => {
  const { data: session }: any = useSession();
  const [products, setProducts]: any = useState([]);
  const [cart, setCart]: any = useState([]);
  const { totalPrice, setTotalPrice }: any = useContext(TotalPriceContext);
  const { cartFinish, setCartFinish }: any = useContext(CartFinishContext);
  // context
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);

  useEffect(() => {
    setTotalPrice(0);
    setCartFinish([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const productsPrice = cartFinish.map((item: any) => {
      const product = getProduct(item.productID);
      if (product) {
        return product.price * parseInt(item.qwt);
      }
    });
    setTotalPrice(() => {
      return productsPrice.reduce((acc: any, curr: any) => acc + curr, 0);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartFinish]);

  useEffect(() => {
    if (session?.accessToken) {
      const getCarts = async () => {
        const response = await cartServices.getCarts();
        if (response.data.message === "kosong") return;
        setCart(response.data.cart);
      };
      getCarts();
    }
  }, [session, alert]);

  useEffect(() => {
    const retriveProducts = async () => {
      const response = await productsServices.getAllProducts();
      setProducts(response.data.data);
    };
    retriveProducts();
  }, []);
  const getProduct = (id: string) => {
    const product = products.find((product: any) => {
      return product.id === id;
    });
    return product || null;
  };

  const handleTick = (item: {
    productID: string;
    size: string;
    qwt: string;
  }) => {
    const check = cartFinish.find(
      (e: { productID: string; size: string; qwt: string }) =>
        e.productID === item.productID && e.size === item.size
    );
    if (check === undefined) {
      setCartFinish((prev: any) => [...prev, item]);
    } else {
      const newFinishCart = cartFinish.filter(
        (e: any) => e.productID !== item.productID || e.size !== item.size
      );
      setCartFinish(newFinishCart);
    }
  };
  const handleDeleteCart = async (productID: string, size: string) => {
    const newCarts = cart.filter(
      (item: any) => item.productID !== productID || item.size !== size
    );
    setCart(newCarts);
    const data = {
      userID: session?.id,
      newCarts,
    };
    const response = await cartServices.deleteCart(data);
    if (response.status === 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 2500);
    }
  };
  return (
    <div className="flex pt-14 justify-center items-center">
      <div className="max-w-[60em] w-full flex justify-between">
        <div className="w-[68%]">
          <h1 className="text-2xl font-bold">Cart</h1>
          <div className="flex flex-col gap-5 ">
            {cart.length > 0 ? (
              cart.map((item: any, i: any) => {
                const product = getProduct(item.productID);
                return (
                  <Fragment key={i}>
                    <div className="flex gap-4 items-start">
                      <Image
                        src={product?.image}
                        alt={product?.name}
                        width={120}
                        height={135}
                        className="shadow-lg shadow-black"
                      />
                      <div className="flex w-full items-center">
                        <div className="w-full">
                          <h4 className="font-bold">{product?.name}</h4>
                          <span className="text-sm text-gray-500">
                            {product?.category}
                          </span>
                          <div className="flex flex-col gap-2 my-2">
                            <div className="flex items-center justify-between gap-2 max-w-[10em] w-full">
                              <label htmlFor="size">size</label>
                              <input
                                id="size"
                                type="text"
                                defaultValue={item.size}
                                className="bg-gray-100 w-[5em] rounded-md text-center py-1 focus:outline-none"
                                pattern="[0-9]*"
                                disabled
                              />
                            </div>
                            <div className="flex items-center justify-between gap-2 max-w-[10em] w-full">
                              <label htmlFor="quantity">quantity</label>
                              <input
                                id="quantity"
                                type="text"
                                defaultValue={item.qwt}
                                className="bg-gray-100 w-[5em] rounded-md text-center py-1 focus:outline-none"
                                pattern="[0-9]*"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span
                              onClick={() =>
                                handleDeleteCart(item.productID, item.size)
                              }
                              className="bg-black cursor-pointer inline-block h-[2em] w-[2em] flex justify-center items-center"
                            >
                              <FaRegTrashCan className="text-lg text-white" />
                            </span>
                            <span
                              onClick={() => handleTick(item)}
                              className={`${
                                cartFinish.find(
                                  (e: {
                                    productID: string;
                                    size: string;
                                    qwt: string;
                                  }) =>
                                    e.productID === item.productID &&
                                    e.size === item.size
                                )
                                  ? "bg-gray-300"
                                  : "bg-black text-white"
                              } bg-black cursor-pointer inline-block h-[2em] w-[2em] flex justify-center items-center`}
                            >
                              <TiTickOutline className="text-1xl" />
                            </span>
                          </div>
                        </div>
                        <div className="">
                          <span className="font-bold">
                            {convertPrice(getProduct(item.productID)?.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <hr className="border-[.7px] border-black" />
                  </Fragment>
                );
              })
            ) : (
              <h1 className="mt-3 text-gray-600">cart masih kosong</h1>
            )}
          </div>
        </div>
        <div className="w-[28%]">
          <h1 className="text-2xl font-bold mb-4">Summary</h1>
          <div className="min-h-[5.5em] flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="font-bold">Sub Total :</span>
              <span>{convertPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Delivery :</span>
              <span>{convertPrice(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Tax :</span>
              <span>{convertPrice(0)}</span>
            </div>
            <hr className="border-[1px] my-3 border-black" />
            <div className="flex justify-between">
              <span className="font-bold">Total :</span>
              <span>{convertPrice(totalPrice)}</span>
            </div>
            <Link
              href={`/checkout`}
              className="bg-black text-white mt-3 py-1 rounded-md flex justify-center"
            >
              <button type="button" className="">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Alert alert={alert} alertMessage={alertMessage} />
    </div>
  );
};

export default CartPage;
