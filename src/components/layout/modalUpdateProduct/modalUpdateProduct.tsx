import Input from "@/components/ui/input";
import Modal from "../modal";
import styles from "./modalUpdateProduct.module.css";
import Label from "@/components/ui/label";
import { FormEvent, useContext, useEffect, useState } from "react";
import Button from "@/components/ui/button";
import { HiMiniPlus } from "react-icons/hi2";
import { productsServices } from "@/services/auth";
import { useSession } from "next-auth/react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "@/lib/firebase/init";
import { modalContext } from "@/context/modalAppears";
import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import Image from "next/image";
import { ProductType } from "@/pages/product";
import { ModalUpdateProductContext } from "@/context/modalUpdateProduct";

const ModalUpdateProduct = ({ product }: { product: ProductType | any }) => {
  const { data: session }: any = useSession();
  const storage = getStorage(app);
  const [image, setImage] = useState<any>();
  const [haveImage, setHaveImage] = useState(false);
  const { setModalUpdateProductAppear }: any =
    useContext(ModalUpdateProductContext);
  const { setAlert }: any = useContext(AlertContext);
  const { setAlertMessage }: any = useContext(AlertMessageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState(product.stock);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: any = e.target as HTMLFormElement;
    setIsLoading(true);
    const data: any = {
      productID: product.id,
      product: {
        name: form.name.value,
        price: form.price.value,
        category: form.gender.value,
        status: form.status.value,
        stock: stock,
        image: product.image,
      },
    };
    const response = await productsServices.updateProduct(data);
    if (response.status === 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setModalUpdateProductAppear(false);
      if (image) {
        const imageName = `product.${image.name.split(".")[1]}`;
        const storageRef = ref(
          storage,
          `images/product/${product.id}/${imageName}`
        );
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (imageUrl) => {
              const data = {
                productID: product.id,
                imageUrl,
              };
              await productsServices.updateProductImage(
                data,
              );
              setAlert(false);
              setAlertMessage("");
              setIsLoading(false);
              return;
            });
          }
        );
      }
      setAlert(false);
      setAlertMessage("");
      setIsLoading(false);
    } else console.log(response);
  };
  return (
    <Modal className={`max-w-[45em]`}>
      <div className="h-[23em] overflow-auto">
        <h1 className="text-base font-bold mb-2">Add Product</h1>
        <form
          onSubmit={(e: any) => handleSubmit(e)}
          className={`${styles.form}`}
        >
          <Label htmlFor="name" className="text-sm">
            Name
          </Label>
          <Input
            id="name"
            type="name"
            name="name"
            placeholder="masukan nama"
            className="rounded-md py-3 mb-3 text-xs md:text-sm"
            required={true}
            defaultValue={product.name}
          />
          <Label htmlFor="price" className="text-sm">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            name="price"
            placeholder="masukan harga"
            className="rounded-md py-3 mb-3 text-xs md:text-sm"
            required={true}
            pattern="^\d+$"
            defaultValue={product.price}
          />
          <label className="text-sm ps-2">Category</label>
          <div className="flex items-center mb-2 mt-1 mb-4">
            <Label htmlFor="man-gender" className="flex text-xs">
              <Input
                id="man-gender"
                type="radio"
                name="gender"
                value="man"
                className="mr-1"
                required={true}
                defaultChecked={product.category === "man" ? true : false}
              />
              Man
            </Label>
            <Label htmlFor="woman-gender" className="flex text-xs">
              <Input
                id="woman-gender"
                type="radio"
                name="gender"
                value="woman"
                className="ml-3 mr-1"
                defaultChecked={product.category === "woman" ? true : false}
              />
              Woman
            </Label>
          </div>
          <Label htmlFor="status" className="text-sm">
            Status
          </Label>
          <select
            name="status"
            id="status"
            className="text-xs focus:outline-none w-full bg-slate-300 px-3 py-2 mb-4 rounded-md"
          >
            {product.status === "released" ? (
              <>
                <option value="released">Released</option>
                <option value="notReleased">Not Released</option>
              </>
            ) : (
              <>
                <option value="notReleased">Not Released</option>
                <option value="released">Released</option>
              </>
            )}
          </select>
          <Label htmlFor="Stock" className="text-sm font-bold">
            Stock
          </Label>
          {Array.isArray(stock) &&
            stock.map((stock: { size: string; qwt: string }, i: number) => (
              <div className="flex items-center mb-2" key={i}>
                <Label htmlFor="size" className="text-sm mr-2">
                  Size
                </Label>
                <Input
                  id="size"
                  type="number"
                  name="size"
                  placeholder="masukan size product"
                  className="py-2 rounded-md text-xs md:text-sm"
                  required={true}
                  defaultValue={stock.size}
                  onChange={(e) =>
                    setStock((prev: any) => {
                      const newArray = [...prev];
                      newArray[i].size = e.target.value;
                      return newArray;
                    })
                  }
                />
                <Label htmlFor="qwt" className="text-sm mr-2">
                  Quantity
                </Label>
                <Input
                  id="qwt"
                  type="number"
                  name="qwt"
                  placeholder="masukan jumlah product"
                  className="py-2 rounded-md text-xs md:text-sm"
                  required={true}
                  defaultValue={stock.qwt}
                  onChange={(e) =>
                    setStock((prev: any) => {
                      const newArray = [...prev];
                      newArray[i].qwt = e.target.value;
                      return newArray;
                    })
                  }
                />
              </div>
            ))}
          <Button
            type="button"
            onClick={() =>
              setStock((prev: any) => {
                return [...prev, { size: "", qwt: "" }];
              })
            }
            className="max-w-[8em] h-[2em] me-2 text-sm"
          >
            Add Stock
          </Button>
          <Button
            type="button"
            onClick={() =>
              setStock((prev: any) => {
                if (prev.length === 1) return prev;
                const newArray = [...prev];
                newArray.pop();
                return newArray;
              })
            }
            className="max-w-[8em] h-[2em] text-sm"
          >
            Delete Stock
          </Button>
          <Label
            htmlFor="image"
            className="py-2 px-3 rounded-md mb-4 text-xs mt-4 flex justify-center"
          >
            <span className="inline-block py-4 px-10 bg-slate-100 rounded-md cursor-pointer">
              {image || product.image ? (
                <div className="flex flex-col gap-4 items-center">
                  <Image
                    src={image ? URL.createObjectURL(image) : product.image}
                    alt={`${image && image.name}-image`}
                    width={200}
                    height={200}
                    className="object-cover h-[5em] w-[5em]"
                  />
                  <span>{image ? image.name : product.name}</span>
                  <span className="font-bold">Upload your image here</span>
                </div>
              ) : (
                <span className="inline-block text-center">
                  Masukan gambar dari product <br /> maximal <b>1 Mb</b>{" "}
                </span>
              )}
            </span>
          </Label>
          <span
            className={`${
              haveImage ? "block" : "hidden"
            } text-red-500 text-sm block text-center translate-y-[-1.5em]`}
          >
            Pilih gambar terlebih dahulu
          </span>
          <Input
            id="image"
            type="file"
            name="image"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <Button
            type="submit"
            className="-translate-y-[.5em] flex justify-center items-center"
          >
            {!isLoading && <HiMiniPlus className="me-2 text-white text-xl" />}
            <span>{isLoading ? "loading..." : "update Product"}</span>
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalUpdateProduct;
