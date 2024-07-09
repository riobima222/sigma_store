import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./product.module.css";
import { productsServices, userServices } from "@/services/auth";
import { modalContext } from "@/context/modalAppears";
import { useSession } from "next-auth/react";
import { DeleteAlertContext } from "@/context/deleteAlert";
import { AlertContext } from "../../../context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import Image from "next/image";
import { convertPrice } from "@/utils/convertPrice";
import Button from "@/components/ui/button";

// Icons
import { HiMiniPlus } from "react-icons/hi2";
import ModalAddProduct from "../modalAddProduct/modalAddProduct";

const AdminProducts = () => {
  const { data: session }: any = useSession();
  const [products, setProducts] = useState([]);
  const [userData, setUserData]: any = useState({});
  const { modalAppear, setModalAppear }: any = useContext(modalContext);
  const [modalLoading, setModalLoading] = useState(false);
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);
  const { deleteAlert, setDeleteAlert }: any = useContext(DeleteAlertContext);
  useEffect(() => {
    const getAdminProducts = async () => {
      const response = await productsServices.getAllProducts();
      setProducts(response.data.data);
    };
    getAdminProducts();
  }, [modalAppear, alert]);
  const handleUpdateButton = (user: any) => {

  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalLoading(true);
    if (session?.user?.username === userData.username) {
    }
    const form = e.target as HTMLFormElement;
    const data = {
      username: form.username.value,
      role: form.select.value,
    };
    const response: any = await userServices.updateUser(
      data,
      session.accessToken
    );
    if (response.data.statusCode === 200) {
      setModalAppear(false);
      setTimeout(() => {
        setAlert(true);
        setAlertMessage(response.data.message);
      }, 300);
      setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 3000);
      setModalLoading(false);
    } else {
      console.log(response);
      setModalLoading(false);
    }
  };
  const handleDeleteButton = (user: any) => {
    setUserData(user);
    setDeleteAlert(true);
  };
  return (
    <>
      <aside className="w-full p-4">
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
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product: any, i: number) => (
                <tr key={i} className={``}>
                  <td className="text-center py-4">{i + 1}</td>
                  <td className="flex justify-center items-center">
                    <Image
                      src={product.image}
                      alt={`${product.name}-image`}
                      width={200}
                      height={200}
                      className="object-cover h-full w-[100px]"
                    />
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
                </tr>
              ))}
          </tbody>
        </table>
      </aside>
      {modalAppear && <ModalAddProduct />}
    </>
  );
};
export default AdminProducts;
