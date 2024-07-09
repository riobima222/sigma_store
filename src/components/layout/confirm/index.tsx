import { AlertContext } from "@/context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import { DeleteAlertContext } from "@/context/deleteAlert";
import { userServices } from "@/services/auth";
import { useSession } from "next-auth/react";
import { useContext } from "react";

interface Props {
  className?: string;
  userData: any;
}

const Confirm = ({ className, userData }: Props) => {
  const { data: session }: any = useSession();
  const { setDeleteAlert }: any = useContext(DeleteAlertContext);
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);
  const handleDeny = () => {
    setDeleteAlert(false);
  };
  const handleAccept = async () => {
    const response = await userServices.deleteUser(
      userData.username,
      session.accessToken
    );
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
