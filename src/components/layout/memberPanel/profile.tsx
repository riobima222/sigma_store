import { userServices } from "@/services/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useContext, useEffect, useState } from "react";
import app from "@/lib/firebase/init";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ModalConfirmContext } from "@/context/modalConfirm";

// Component Imports
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import ModalConfirm from "@/components/layout/modalConfirm";

// Icons Imports
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

const Profile = () => {
  const { data: session }: any = useSession();

  // state
  const [profile, setProfile]: any = useState(false);
  const [profileImage, setProfileImage] = useState<any>(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);
  const [newDataUpdate, setNewDataUpdate] = useState<any>({});
  const [username, setUsername] = useState(false);
  const [phone, setPhone] = useState(false);
  const [oldPassword, setOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  // context
  const { setModalConfirmAlert } = useContext<any>(ModalConfirmContext);
  // firebase
  const storage = getStorage(app);
  useEffect(() => {
    if (session) {
      const retriveProfile = async () => {
        const res = await userServices.getProfile(session?.accessToken);
        setProfile(res.data.data);
        setUsername(res.data.data.username);
        setPhone(res.data.data.phone);
      };
      retriveProfile();
    } else {
      console.log("token nya belum siap brother");
    }
  }, [session, alert]);
  const handleFileInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const file = form.profile.files[0];
    const newName = `profile.${file.name.split(".")[1]}`;
    const storageRef = ref(storage, `images/user/${session.id}/${newName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfile({ ...profile, image: downloadURL });
          const profileImageUpdate = async () => {
            try {
              const response = await userServices.updateProfile(
                session?.accessToken,
                { imageURL: downloadURL }
              );
              if (response.status === 200) {
                setProfileImage(false);
                setAlert(true);
                setAlertMessage(response.data.message);
                setTimeout(() => {
                  setAlert(false);
                  setAlertMessage("");
                }, 2500);
              }
            } catch (error) {
              console.log(error);
            }
          };
          profileImageUpdate();
        });
      }
    );
  };
  const handleUpdateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalConfirmAlert(true);
    const form = e.target as HTMLFormElement;
    setNewDataUpdate({
      username: profile?.username,
      newUsername: form.username.value,
      phone: form.phone.value,
    });
  };
  const handleUpdateButton = async () => {
    const response = await userServices.updateDataProfile(
      session?.accessToken,
      newDataUpdate
    );
    setModalConfirmAlert(false);
    if (response.status === 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 2500);
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const response = await userServices.changePassword(session?.accessToken, {
      oldPassword: form.oldpassword.value,
      newPassword: form.newpassword.value,
    });
    if (response.data.statusCode === 200) {
      setAlert(true);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlert(false);
        setAlertMessage("");
      }, 2000);
    } else {
      setWrongPassword(true);
      setTimeout(() => {
        setWrongPassword(false);
      }, 2500);
    }
  };

  const seeOldPassword = () => {
    setOldPassword((prev) => !prev);
  };
  const seeNewPassword = () => {
    setNewPassword((prev) => !prev);
  };
  return (
    <div className="w-full p-4">
      <h1 className="font-bold text-xl mb-2 ms-4">Profile</h1>
      <div className="flex gap-2 items-start">
        <div className="max-w-[20%] w-full min-h-64 border-2 p-4 flex flex-col justify-center items-center">
          <form
            onSubmit={(e) => handleFileInput(e)}
            className="w-full justify-center items-center flex flex-col"
          >
            <label htmlFor="profile" className="w-[50%] h-[50%] cursor-pointer">
              <Image
                src={profile?.image || "/asdas"}
                alt="profile-image"
                width={50}
                height={50}
                className="rounded-full w-full h-full object-cover text-xs"
              ></Image>
            </label>
            {profileImage ? (
              <p className="translate-y-4 text-center bg-gray-100 px-2 py-1 rounded-md mb-1">
                {profileImage.name}
              </p>
            ) : (
              <label
                htmlFor="profile"
                className="cursor-pointer text-center translate-y-4 py-2 rounded-md bg-gray-200"
              >
                upload foto profile kamu, max file <b>1mb</b>{" "}
              </label>
            )}
            <Input
              onChange={(files) => setProfileImage(files.target.files[0])}
              className="hidden"
              type="file"
              id="profile"
              name="profile"
            />
            {profileImage && (
              <button className="translate-y-5 bg-black text-white px-2 py-1 rounded-md">
                change
              </button>
            )}
          </form>
        </div>
        <form
          onSubmit={(e) => handleUpdateSubmit(e)}
          className="max-w-[55%] w-full min-h-64 border-2 p-4"
        >
          <Label htmlFor="username" className="text-base font-bold">
            username
          </Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile?.username || ""}
            type="text"
            className="rounded-md mb-2 h-10"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Label htmlFor="email" className="text-base font-bold">
            email
          </Label>
          <Input
            id="email"
            name="email"
            defaultValue={profile?.email}
            type="email"
            className="rounded-md mb-2 text-gray-400 h-10"
            disabled={true}
          />
          <Label htmlFor="phone" className="text-base font-bold">
            phone
          </Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={profile?.phone}
            type="tel"
            className="rounded-md mb-2 h-10"
            onChange={(e) => setPhone(e.target.value)}
            pattern="^(08)[0-9]{9,12}$"
          />
          <Label htmlFor="role" className="text-base font-bold">
            role
          </Label>
          <Input
            id="role"
            name="role"
            defaultValue={profile?.role}
            type="text"
            className="rounded-md mb-2 text-gray-400 h-10"
            disabled
          />
          <button
            type="submit"
            className={`${
              profile?.username !== username || profile?.phone !== phone
                ? "bg-black"
                : "bg-gray-600"
            } text-white px-2 py-1 rounded-md mt-2`}
            disabled={
              profile?.username !== username || profile?.phone !== phone
                ? false
                : true
            }
          >
            update
          </button>
        </form>
        <div className="max-w-[25%] w-full border-2 p-3">
          <h1 className="text-lg font-bold mb-2">Change Password</h1>
          <form onSubmit={(e) => handleChangePassword(e)}>
            <Label htmlFor="oldpassword" className="text-base">
              old password
            </Label>
            <div className="flex h-10 items-center bg-slate-100 rounded-md">
              <Input
                id="oldpassword"
                name="oldpassword"
                type={oldPassword ? "text" : "password"}
                className="rounded-md h-10"
              />
              {oldPassword ? (
                <FaEyeSlash
                  onClick={seeOldPassword}
                  className="cursor-pointer me-2 text-md w-6 h-6"
                />
              ) : (
                <IoEyeSharp
                  onClick={seeOldPassword}
                  className="cursor-pointer me-2 text-md w-6 h-6"
                />
              )}
            </div>
            <span
              className={`${
                wrongPassword ? "block" : "hidden"
              } text-sm text-red-500 mb-2 text-center w-full block`}
            >
              password salah
            </span>
            <Label htmlFor="newpassword" className="text-base">
              new password
            </Label>
            <div className="flex h-10 items-center bg-slate-100 rounded-md">
              <Input
                id="newpassword"
                name="newpassword"
                type={newPassword ? "text" : "password"}
                className="rounded-md h-10"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
              />
              {newPassword ? (
                <FaEyeSlash
                onClick={seeNewPassword}
                className="cursor-pointer me-2 text-md w-6 h-6"
                />
              ) : (
                <IoEyeSharp
                onClick={seeNewPassword}
                className="cursor-pointer me-2 text-md w-6 h-6"
              />
              )}
            </div>
            <button
              type="submit"
              className="bg-black text-white px-2 py-1 mt-2 rounded-md"
            >
              change
            </button>
          </form>
        </div>
      </div>
      <ModalConfirm>
        <div role="alert" className="alert max-w-[40em] w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Yakin ingin update data ?</span>
          <div>
            <button
              onClick={() => setModalConfirmAlert(false)}
              className="btn btn-sm"
            >
              no
            </button>
            <button
              onClick={handleUpdateButton}
              className="btn btn-sm btn-primary"
            >
              yes
            </button>
          </div>
        </div>
      </ModalConfirm>
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
  );
};
export default Profile;
