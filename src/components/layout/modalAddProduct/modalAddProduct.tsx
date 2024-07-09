import Input from "@/components/ui/input";
import Modal from "../modal";
import styles from "./modalAddProduct.module.css";
import Label from "@/components/ui/label";
import { useState } from "react";
import Button from "@/components/ui/button";
import { HiMiniPlus } from "react-icons/hi2";

const ModalAddProduct = () => {
  const [stock, setStock] = useState([
    {
      size: "",
      qwt: "",
    },
  ]);
  return (
    <Modal className={`max-w-[45em]`}>
      <div className="h-[23em] overflow-auto">
        <h1 className="text-base font-bold mb-2">Add Product</h1>
        <form className={`${styles.form}`}>
          <Label htmlFor="name" className="text-sm">
            Name
          </Label>
          <Input
            id="name"
            type="name"
            name="name"
            placeholder="masukan nama"
            className="rounded-md py-3 mb-3 text-xs md:text-sm"
            required
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
            required
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
                required
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
                required
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
                  type="text"
                  name="size"
                  placeholder="masukan size product"
                  required
                  className="py-2 rounded-md text-xs md:text-sm"
                />
                <Label htmlFor="qwt" className="text-sm mr-2">
                  Quantity
                </Label>
                <Input
                  id="qwt"
                  type="number"
                  name="qwt"
                  placeholder="masukan jumlah product"
                  required
                  className="py-2 rounded-md text-xs md:text-sm"
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
              Masukan gambar product, <br /> maximal size adalah{" "}
              <b>
                {" "}
                <i>10mb</i>{" "}
              </b>
            </span>
          </Label>
          <Input id="image" type="file" name="image" className="hidden" />
          <Button
            type="submit"
            className="-translate-y-[.5em] flex justify-center items-center"
          >
            <HiMiniPlus className="me-2 text-white text-xl" />
            <span>Add Product</span>
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default ModalAddProduct;
