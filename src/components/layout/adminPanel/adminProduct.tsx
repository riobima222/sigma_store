import { useContext, useEffect, useState } from "react";
import styles from "./product.module.css";
import { productsServices } from "@/services/auth";
import { modalContext } from "@/context/modalAppears";
import { AlertContext } from "../../../context/alert";
import Image from "next/image";
import { convertPrice } from "@/utils/convertPrice";
import Button from "@/components/ui/button";
import ModalAddProduct from "../modalAddProduct/modalAddProduct";
import { AlertMessageContext } from "@/context/alertMessage";
import ModalUpdateProduct from "../modalUpdateProduct/modalUpdateProduct";

// Icons
import { HiMiniPlus } from "react-icons/hi2";
import { FiEdit } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { ModalUpdateProductContext } from "@/context/modalUpdateProduct";
import { useSession } from "next-auth/react";
import Confirm from "../confirm";
import { DeleteProductAlertContext } from "@/context/deleteProductAlert";
import Alert from "@/components/alert";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [productURLImage, setProductURLImage] = useState("");
  const [productID, setProductID] = useState("");

  // CONTEXT :
  const { modalAppear, setModalAppear }: any = useContext(modalContext);
  const { deleteProductAlert, setDeleteProductAlert }: any = useContext(
    DeleteProductAlertContext
  );
  const { modalUpdateProductAppear, setModalUpdateProductAppear }: any =
    useContext(ModalUpdateProductContext);
  const { alert }: any = useContext(AlertContext);
  const { alertMessage }: any = useContext(AlertMessageContext);
  useEffect(() => {
    const getAdminProducts = async () => {
      const response = await productsServices.getAllProducts();
      setProducts(response.data.data);
    };
    getAdminProducts();
  }, [modalAppear, alert, modalUpdateProductAppear]);

  const handleDeleteProduct = async (
    productID: string,
    productURLImage: string
  ) => {
    setDeleteProductAlert(true);
    setProductID(productID);
    setProductURLImage(productURLImage);
  };
  return (
    <>
      <aside className="w-full p-4 h-screen overflow-auto">
        <h1 className="text-xl font-bold mb-2">User Management</h1>
        <Button
          type="button"
          className="max-w-[10em] flex justify-center items-center mb-1"
          onClick={() => setModalAppear(true)}
        >
          <HiMiniPlus className="me-2 text-white" />
          <span>Add Product</span>
        </Button>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>
                <div className="w-full">
                  <span className="border-b-[2px] py-1 flex justify-center items-center border-white inline-block w-full">
                    Stock
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="inline-block w-[50%] px-1 py-1 border-r-[2px] border-white">
                      size
                    </span>
                    <span className="inline-block w-[50%] px-1 py-1">qty</span>
                  </div>
                </div>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product: any, i: number) => (
                <tr key={i} className={`${i % 2 === 0 ? "" : "bg-gray-200"}`}>
                  <td className="text-center py-4">{i + 1}</td>
                  <td className="py-3">
                    <div className="mx-auto w-[7em] h-[7em]">
                      <Image
                        src={product.image}
                        alt={`${product.name}-image`}
                        width={200}
                        height={200}
                        className="object-cover h-full w-[w-full]"
                      />
                    </div>
                  </td>
                  <td className="text-center py-4">{product.name}</td>
                  <td className="text-center py-4">{product.category}</td>
                  <td className="text-center py-4">
                    {convertPrice(product.price)}
                  </td>
                  <td>
                    {product.stock.map((stock: any, i: number) => (
                      <div className="flex justify-between" key={i}>
                        <div className="w-[50%] text-center py-4">
                          {stock.size}
                        </div>
                        <div className="w-[50%] text-center py-4">
                          {stock.qwt}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="text-center py-4">
                    <div className="flex gap-3 justify-center items-center">
                      <span
                        onClick={() => {
                          setModalUpdateProductAppear(true);
                          setProduct(product);
                        }}
                        className="bg-yellow-300 cursor-pointer inline-block h-[2em] w-[2em] flex justify-center items-center"
                      >
                        <FiEdit className="text-lg text-black" />
                      </span>
                      <span
                        onClick={() =>
                          handleDeleteProduct(product.id, product.image)
                        }
                        className="bg-red-500 cursor-pointer inline-block h-[2em] w-[2em] flex justify-center items-center"
                      >
                        <FaRegTrashCan className="text-lg text-white" />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Alert alert={alert} alertMessage={alertMessage} />
      </aside>
      {modalAppear && <ModalAddProduct />}
      {modalUpdateProductAppear && <ModalUpdateProduct product={product} />}
      <Confirm
        productID={productID}
        productURLImage={productURLImage}
        from="adminProduct"
        className={`${
          deleteProductAlert ? "block" : "hidden"
        } bg-slate-300 border-none absolute bottom-2 right-0 h-[2.9em] flex items-center justify-between px-3 max-w-[40em]`}
      />
    </>
  );
};
export default AdminProducts;
