import Input from "@/components/ui/input";
import Modal from "../modal";
import styles from "./modalAddProduct.module.css";
import Label from "@/components/ui/label";
import { useContext, useState } from "react";
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

const ModalAddProduct = () => {
  const { data: session }: any = useSession();
  const storage = getStorage(app);
  const [image, setImage] = useState<any>();
  const [haveImage, setHaveImage] = useState(false);
  const { setModalAppear }: any = useContext(modalContext);
  const { setAlert }: any = useContext(AlertContext);
  const { setAlertMessage }: any = useContext(AlertMessageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState([
    {
      size: "",
      qwt: "",
    },
  ]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (e.target.image.files.length === 0) {
      setHaveImage(true);
      setIsLoading(false);
      setTimeout(() => {
        setHaveImage(false);
      }, 1500);
      return;
    }
    const data = {
      name: e.target.name.value,
      price: e.target.price.value,
      category: e.target.gender.value,
      status: e.target.status.value,
      stock: stock,
      image: "",
    };
    const response = await productsServices.addProduct(
      data
    );
    if (response.data.statusCode == 200) {
      const image = e.target.image.files[0];
      const newName = `product.${image.name.split(".")[1]}`;
      const storageRef = ref(
        storage,
        `images/product/${response.data.productID}/${newName}`
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
          getDownloadURL(uploadTask.snapshot.ref).then((imageUrl) => {
            const productImage = async () => {
              const data = { imageUrl, productID: response.data.productID };
              await productsServices.updateProductImage(
                data
              );
            };
            productImage();
            setModalAppear(false);
            setAlert(true);
            setAlertMessage(response.data.message);
            setTimeout(() => {
              setAlert(false);
              setAlertMessage("");
            }, 2000);
          });
        }
      );
    }
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
                defaultChecked
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
            <option value="released">Released</option>
            <option value="notReleased">Not Released</option>
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
                  onChange={(e) =>
                    setStock((prev) => {
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
                  onChange={(e) =>
                    setStock((prev) => {
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
              setStock((prev) => {
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
              {image ? (
                <div className="flex flex-col gap-4 items-center">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`${image.name}-image`}
                    width={200}
                    height={200}
                    className="object-cover h-[5em] w-[5em]"
                  />
                  <span>{image.name}</span>
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
            <span>{isLoading ? "loading..." : "Add Product"}</span>
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalAddProduct;
