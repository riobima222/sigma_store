import { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./users.module.css";
import { dataServices, userServices } from "@/services/auth";
import Modal from "../modal";
import Input from "../../ui/input";
import { modalContext } from "@/context/modalAppears";
import { useSession } from "next-auth/react";
import Confirm from "../confirm";
import { DeleteAlertContext } from "@/context/deleteAlert";
import { AlertContext } from "../../../context/alert";
import { AlertMessageContext } from "@/context/alertMessage";
import Alert from "@/components/alert";
const Users = () => {
  const { data: session }: any = useSession();
  const [users, setUsers] = useState([]);
  const [userData, setUserData]: any = useState({});
  const { modalAppear, setModalAppear }: any = useContext(modalContext);
  const [modalLoading, setModalLoading] = useState(false);
  const { alert, setAlert }: any = useContext(AlertContext);
  const { alertMessage, setAlertMessage }: any =
    useContext(AlertMessageContext);
  const [username, setUsername]: any = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const { deleteAlert, setDeleteAlert }: any = useContext(DeleteAlertContext);
  useEffect(() => {
    const getAllData = async () => {
      const data = await dataServices.getAllData();
      setUsers(data.data);
    };
    getAllData();
  }, [modalAppear, alert]);
  const handleUpdateButton = (user: any) => {
    setUserData(user);
    setModalAppear(true);
    setUsername(user.username);
    setEmail(user.email);
    setPhone(user.phone);
    setRole(user.role);
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
      data
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
    <aside className="w-full p-4">
      <h1 className="text-xl font-bold mb-2">User Management</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user: any, i: number) => (
              <tr
                key={i}
                className={`${
                  user.username === session?.user?.username ? "bg-gray-300" : ""
                }`}
              >
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>
                  <div className={styles.button}>
                    <button
                      className="bg-black"
                      onClick={() => handleUpdateButton(user)}
                      type="button"
                    >
                      update
                    </button>
                    <button
                      className={`${
                        session?.user?.role !== "super" ||
                        user.username === session?.user?.username
                          ? "bg-gray-600"
                          : "bg-black"
                      }`}
                      type="button"
                      onClick={() => handleDeleteButton(user)}
                      disabled={
                        session?.user?.role !== "super" ||
                        session?.user?.username === user.username
                      }
                    >
                      delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {modalAppear && (
        <Modal className={`max-w-[40em]`}>
          <h1 className="text-xl font-bold text-center mb-3">User Detail</h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-4"
          >
            <Input
              onChange={(e: any) => setUsername(e.target.value)}
              id="username"
              type="text"
              name="username"
              defaultValue={userData.username}
              disabled={
                session?.user?.username === userData.username ? false : true
              }
              className="rounded-md py-4"
            />
            <Input
              onChange={(e: any) => setEmail(e.target.value)}
              id="email"
              type="email"
              name="email"
              defaultValue={userData.email}
              disabled={
                session?.user?.username === userData.username ? false : true
              }
              className="rounded-md py-4"
            />
            <Input
              onChange={(e: any) => setPhone(e.target.value)}
              id="phone"
              type="tel"
              name="phone"
              defaultValue={userData.phone}
              disabled={
                session?.user?.username === userData.username ? false : true
              }
              className="rounded-md py-4"
            />
            <select
              name="select"
              className={`bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none`}
              disabled={
                session?.user?.role === "super" &&
                session?.user?.username !== userData.username
                  ? false
                  : session?.user?.role === "admin" &&
                    userData.role === "member" &&
                    userData.role !== "super"
                  ? false
                  : true
              }
              onChange={(e: any) => setRole(e.target.value)}
            >
              {userData.role === "super" ? (
                <option>super</option>
              ) : (
                <>
                  <option>
                    {userData.role === "admin" ? "admin" : "member"}
                  </option>
                  <option>
                    {userData.role === "admin" ? "member" : "admin"}
                  </option>
                </>
              )}
            </select>
            <button
              type="submit"
              className={`${
                userData.username !== username ||
                userData.email !== email ||
                userData.phone !== phone ||
                userData.role !== role
                  ? "bg-black"
                  : "bg-gray-600"
              } rounded-md py-2 px-2 text-white`}
              disabled={
                userData.username !== username ||
                userData.email !== email ||
                userData.phone !== phone ||
                userData.role !== role
                  ? false
                  : true
              }
            >
              {modalLoading ? "Loading" : "update"}
            </button>
          </form>
        </Modal>
      )}
      <Alert alert={alert} alertMessage={alertMessage} />
      <Confirm
        userData={userData}
        className={`${
          deleteAlert ? "block" : "hidden"
        } bg-slate-300 border-none absolute bottom-2 right-0 h-[2.9em] flex items-center justify-between px-3 max-w-[40em]`}
      ></Confirm>
    </aside>
  );
};
export default Users;
