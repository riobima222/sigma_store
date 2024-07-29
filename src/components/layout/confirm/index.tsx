import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import { DeleteAlertContext } from "@/context/deleteAlert";
import { DeleteProductAlertContext } from "@/context/deleteProductAlert";
import { productsServices, userServices } from "@/services/auth";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import app from "@/lib/firebase/init";
import { getStorage, ref, deleteObject } from "firebase/storage";

interface Props {
  className?: string;
  userData?: any;
  from?: string;
  productID?: any;
  productURLImage?: string;
}

const Confirm = ({ className, userData, from, productID }: Props) => {
  const storage = getStorage(app);
  const { data: session }: any = useSession();
  const { setDeleteAlert }: any = useContext(DeleteAlertContext);
  const { setAlert }: any = useContext(AlertContext);
  const { setDeleteProductAlert }: any = useContext(DeleteProductAlertContext);
  const { setAlertMessage }: any = useContext(AlertMessageContext);
  const handleDeny = () => {
    setDeleteAlert(false);
    setDeleteProductAlert(false);
  };
  const handleAccept = async () => {
    if (from === "adminProduct") {
      const response = await productsServices.deleteProduct(productID);
      if (response.status === 200) {
        setAlert(true);
        setAlertMessage(response.data.message);
        setDeleteProductAlert(false);
        setTimeout(() => {
          setAlert(false);
          setAlertMessage("");
        }, 2500);
        const filePath = `images/product/${productID}/product.jpg`;
        const storageRef = ref(storage, filePath);
        try {
          await deleteObject(storageRef);
          console.log("berhasil menghapus image");
        } catch (err) {
          console.log("ada yang error kawaw");
        }
      } else {
        console.log(response);
      }
    } else {
      const response = await userServices.deleteUser(userData.username);
      if (response.data.statusCode === 200) {
        setDeleteAlert(false);
        setAlert(true);
        setAlertMessage(response.data.message);
        setTimeout(() => {
          setAlert(false);
          setAlertMessage("");
        }, 2500);
      } else {
        console.log(response);
      }
    }
  };
  return (
    <div role="alert" className={`alert ${className}`}>
      <div className="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="ms-2">Are you sure ?.</span>
      </div>
      <div className="">
        <button onClick={handleDeny} className="btn btn-sm">
          Deny
        </button>
        <button
          onClick={handleAccept}
          className="btn btn-sm bg-black text-white hover:text-black ms-2"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default Confirm;
