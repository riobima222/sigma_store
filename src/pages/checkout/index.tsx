import { cartServices, productsServices, userServices } from "@/services/auth";
import { convertPrice } from "@/utils/convertPrice";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, Fragment, useContext, useEffect, useState } from "react";
import Alert from "../../components/alert";

import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import Link from "next/link";
import { modalContext } from "@/context/modalAppears";
import Modal from "@/components/layout/modal";
import { CartFinishContext } from "@/context/cartFinish";
import { TotalPriceContext } from "@/context/totalPrice";

// ICONS :
import { FaRegTrashCan } from "react-icons/fa6";
import { MdEditSquare } from "react-icons/md";

const CheckoutPage = () => {
  const { data: session }: any = useSession();
  const [products, setProducts]: any = useState([]);
  const [profile, setProfile]: any = useState({});
  const [address, setAddress] = useState<any>({});
  const [allAddress, setAllAddress] = useState([]);
  const [indexAlamat, setIndexAlamat]: any = useState(0);
  const [perbaharuiProfile, setPerbaharuiProfile] = useState(false);

  // context
  const { cartFinish }: any = useContext(CartFinishContext);
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);
  const { modalAppear, setModalAppear }: any = useContext(modalContext);
  const { totalPrice, setTotalPrice }: any = useContext(TotalPriceContext);
  const [addAddress, setAddAddress] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      const getCarts = async () => {
        const response = await userServices.getProfile();
        setProfile(response.data.data || {});
        setAllAddress(response.data.data.address);
        setAddress(() => {
          if (response.data.data.address) {
            const adress = response.data.data.address.find(
              (item: any) => item.isMain === true
            );
            return adress;
          }
        });
      };
      getCarts();
    }
  }, [session, perbaharuiProfile]);

  useEffect(() => {
    const retriveProducts = async () => {
      const response = await productsServices.getAllProducts();
      setProducts(response.data.data || []);
    };
    retriveProducts();
  }, []);

  const getProduct = (id: string) => {
    const product = products.find((product: any) => {
      return product.id === id;
    });
    return product || null;
  };

  const handleChoiceAddress = (i: number, item: any) => {
    setIndexAlamat(i);
    setAddress(item);
    setTimeout(() => {
      setModalAppear(false);
    }, 500);
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const tambahAlamatBaru = {
      recipient: form.recipient.value,
      addressLine: form.lineaddress.value,
      phone: form.phone.value,
      note: form.note.value,
    };
    const response = await userServices.addAddress(tambahAlamatBaru);
    if (response.status === 200) {
      setAddAddress(false);
      form.recipient.value = "";
      form.lineaddress.value = "";
      form.phone.value = "";
      form.note.value = "";
      setPerbaharuiProfile((prev) => !prev);
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 2500);
    }
  };

  const handleDeleteAddress = async (i: number) => {
    const newAllAddress = allAddress.filter(
      (item: any, index: number) => index !== i
    );
    const response = await userServices.updateAddress(newAllAddress);
    if (response.status == 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setPerbaharuiProfile((prev) => !prev);
        setAlert(false);
        setAlertMessage("");
      }, 2500);
    }
  };
  
  const handleSetMainAddress = async (i: number) => {
    const newAllAddress = allAddress.map((item: any, index: number) => {
      if (index === i) {
        return { ...item, isMain: true };
      } else {
        return { ...item, isMain: false };
      }
    });
    const response = await userServices.updateAddress(newAllAddress);
    if (response.status == 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setPerbaharuiProfile((prev) => !prev);
        setAlert(false);
        setAlertMessage("");
      }, 2500);
    }
  }
  return (
    <div className="flex pt-14 justify-center items-center px-4">
      <div className="max-w-[60em] w-full flex justify-between">
        <div className="w-[68%]">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <div className="flex flex-col gap-5">
            <div className="border-2 mt-3 p-3">
              <h3 className="font-bold">Shipping Address :</h3>
              {address && Object.keys(address).length > 0 ? (
                <div className="mt-2">
                  <h5>
                    {" "}
                    <b>{address.recipient}</b> - {address.phone}
                  </h5>
                  <h5 className="text-sm">- {address.addressLine} -</h5>
                  <p className="mt-2">
                    <b>Note</b> : {address.note || "-"}
                  </p>
                </div>
              ) : (
                <h1 className="text-gray-500 text-sm text-center">
                  kamu belum punya alamat
                </h1>
              )}
              <button
                onClick={() => {
                  setModalAppear(true);
                }}
                className="w-full flex justify-center bg-black text-white py-1 rounded-md mt-3"
              >
                change address
              </button>
            </div>
            <div className="border-2">
              {cartFinish || cartFinish.length > 0 ? (
                cartFinish.map((item: any, i: any) => {
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
                            <div className="flex gap-2"></div>
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
                <h1 className="text-gray-600 text-center">checkout kosong</h1>
              )}
            </div>
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
                buy
              </button>
            </Link>
          </div>
        </div>
      </div>
      {modalAppear && (
        <Modal className="max-w-[40em]">
          <div
            className={`${
              addAddress
                ? "overflow-auto max-h-[19em]"
                : "overflow-auto max-h-[17.5em]"
            }`}
          >
            {Object.keys(profile).length > 0 &&
              profile.address &&
              profile.address.map((item: any, i: number) => (
                <div key={i} className="mb-5">
                  <div
                    onClick={() => handleChoiceAddress(i, item)}
                    className={`${
                      indexAlamat === i && "border-black"
                    } mt-2 border-2 p-2 relative`}
                  >
                    <h5>
                      {" "}
                      <b>{item.recipient}</b> - {item.phone}
                    </h5>
                    <h5>- {item.addressLine} -</h5>
                    <p className="mt-2">
                      <b>Note</b> : {item.note || "-"}
                    </p>
                    <span
                      className={`${
                        item.isMain ? "block" : "hidden"
                      } absolute text-xs bg-black font-bold px-2 py-1 text-white top-[5px] right-[5px]`}
                    >
                      main
                    </span>
                  </div>
                  <div className={`${item.isMain ? "hidden" : "flex"
                    } gap-2 max-w-[8em]`}>
                    <button
                      onClick={() => handleSetMainAddress(i)}
                      type="button"
                      className="bg-black w-full py-2 flex justify-center items-center"
                    >
                      <MdEditSquare className="text-lg text-white" />{" "}
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(i)}
                      type="button"
                      className="bg-black w-full py-2 flex justify-center items-center"
                    >
                      <FaRegTrashCan className="text-lg text-white" />
                    </button>
                  </div>
                </div>
              ))}
            <button
              onClick={() => setAddAddress(!addAddress)}
              className="bg-black text-white mt-3 py-1 px-3 rounded-md"
            >
              {addAddress ? "cancel" : "add new address"}
            </button>
            <form
              onSubmit={(e) => handleAddAddress(e)}
              className={`${addAddress ? "block" : "hidden"} mt-3`}
            >
              <label htmlFor="recipient" className="ms-2">
                recipient
              </label>
              <input
                placeholder="your name"
                type="text"
                name="recipient"
                className="border-2 text-sm mb-2 block w-full p-2 px-3 focus:outline-none"
              />
              <label htmlFor="lineaddress" className="ms-2">
                address line
              </label>
              <input
                placeholder="jln.panglima sudirman no.1 ..."
                type="text"
                id="lineaddress"
                name="lineaddress"
                className="border-2 text-sm mb-2 block w-full p-2 px-3 focus:outline-none"
              />
              <label htmlFor="phone" className="ms-2">
                phone
              </label>
              <input
                placeholder="08xxxxxxxxx"
                type="tel"
                id="phone"
                name="phone"
                className="border-2 text-sm mb-2 block w-full p-2 px-3 focus:outline-none"
              />
              <label htmlFor="note" className="ms-2 block">
                note
              </label>
              <textarea
                name="note"
                id="note"
                placeholder="the house is blue ..."
                className="text-black w-full focus:outline-none border-2 p-2 px-3 min-h-[7em] text-sm"
              />
              <button
                type="submit"
                className="w-full bg-black py-2 text-center text-white text-sm"
              >
                add
              </button>
            </form>
          </div>
        </Modal>
      )}
      <Alert alert={alert} alertMessage={alertMessage} />
    </div>
  );
};

export default CheckoutPage;
