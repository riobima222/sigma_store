import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import { cartServices, productsServices } from "@/services/auth";
import { convertPrice } from "@/utils/convertPrice";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const DetailProductPage = () => {
  const { productID }: any = useRouter().query;
  const session = useSession();
  const [product, setProduct]: any = useState({});
  const [cart, setCart]: any = useState(null);
  const [noCartAlert, setNoCartAlert] = useState(false);
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getDetailProduct = async () => {
      if (productID) {
        const response = await productsServices.getOneProduct(productID);
        setProduct(response.data.data);
      }
    };
    getDetailProduct();
  }, [productID]);
  const handleAddToCart = async () => {
    if (!cart) {
      setNoCartAlert(true);
      setTimeout(() => {
        setNoCartAlert(false);
      }, 2500);
      return;
    }
    if (session.status === "unauthenticated") {
      console.log("berhasil masuk kisini");
      router.push(
        `/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }
    setIsLoading(true);
    const response = await cartServices.addToCart(cart);
    if (response.status === 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlertMessage("");
        setAlert(false);
        setIsLoading(false);
      }, 2500);
    }
  };
  return (
    <>
      <Head>
        <title>Sigma - products</title>
      </Head>
      <div className="min-h-screen flex justify-center items-center">
        <div className="max-w-[50em] flex gap-4 w-full h-[25em]">
          <div className="w-[50%] h-full">
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className={`w-full h-full shadow-lg shadow-black`}
            />
          </div>
          <div className="w-[50%] h-[25em] p-3 overflow-y-auto flex flex-col justify-between">
            <div>
              <h1 className="font-bold text-xl">{product.name}</h1>
              <span className="text-sm">{product.category}</span>
              <br />
              <span className="font-bold inline-block mt-2 mb-3 bg-gray-500 text-white py-2 px-3 rounded-md">
                {convertPrice(product.price)}
              </span>
              <h3 className="font-bold tracking-widest mb-2 mt-2">Size :</h3>
              <div className="flex flex-wrap gap-2 max-w-[18em]">
                {Object.keys(product).length > 0 &&
                  product.stock.length > 0 &&
                  product.stock.map((stock: any, i: number) => (
                    <>
                      <Input
                        id={`size-${stock.size}`}
                        key={i}
                        type="radio"
                        name="size"
                        className={`hidden`}
                        value={stock.size}
                        onClick={(e) =>
                          setCart({ size: e.target.value, qwt: 1, productID })
                        }
                        disabled={stock.qwt == 0 ? true : false}
                      />
                      <Label
                        className={`${
                          stock.qwt == 0
                            ? "bg-gray-200 hover:cursor-not-allowed"
                            : "border-gray-300"
                        } cursor-pointer inline-block text-sm px-[1.5em] py-[.4em] ps-[2em] pe-[2em] rounded-md flex justify-center border-2 focus:border-black`}
                        htmlFor={`size-${stock.size}`}
                      >
                        {stock.size}
                      </Label>
                    </>
                  ))}
              </div>
            </div>
            <div>
              <div
                className={`${
                  noCartAlert ? "block" : "hidden"
                } text-sm text-red-500 text-center tracking-widest`}
              >
                Pick size first
              </div>
              <Button onClick={handleAddToCart} type="button">
                {isLoading ? "Loading..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
        <div
          role="alert"
          className={`${
            alert ? "block" : "hidden"
          } alert alert-success bg-slate-300 border-none absolute bottom-2 right-0 h-[2.7em] flex items-center px-3 max-w-[40em]`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{alertMessage}</span>
        </div>
      </div>
    </>
  );
};
export default DetailProductPage;
