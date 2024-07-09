import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "./init";
import bcrypt, { compare, hash } from "bcrypt";

// Interface
import { GoogleUser, UserData, UserGoogle } from "./interface";

const firestore = getFirestore(app);

//    DATABASE

export const retriveData = async (collectionName: string) => {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  const fixData = data.map((data: any) => {
    delete data.password;
    delete data.id;
    return data;
  });
  return fixData;
};

export const retriveDataByID = async (collectionName: string, id: string) => {
  try {
    const snapshot = await getDoc(doc(firestore, collectionName, id));
    const data = snapshot.data();
    return data;
  } catch (error) {
    return false;
  }
};

export const signUp = async (userData: UserData) => {
  const q1 = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );
  const q2 = query(
    collection(firestore, "users"),
    where("username", "==", userData.username)
  );
  const snapshot1 = await getDocs(q1);
  const snapshot2 = await getDocs(q2);
  const data1 = snapshot1.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const data2 = snapshot2.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data2.length > 0) {
    return { code: 400, status: false };
  } else {
    userData.role = "member";
    userData.created_at = new Date();
    userData.updated_at = new Date();
    userData.password = await bcrypt.hash(userData.password, 10);
    try {
      await addDoc(collection(firestore, "users"), userData);
      return { code: 200, status: true };
    } catch (error) {
      return { code: 500, status: false };
    }
  }
};

export const signUpGoogle = async (user: GoogleUser) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", user.username)
  );
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (data.length > 0) {
    return data[0];
  } else {
    await addDoc(collection(firestore, "users"), user);
    const snapshot = await getDocs(q);
    const googleUser = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return googleUser[0];
  }
};

export const userLogin = async (data: {
  username: string;
  password: string;
}) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", data.username)
  );
  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (user.length > 0) {
    return user[0];
  } else {
    return null;
  }
};

export const loginGoogle = async (data: UserGoogle) => {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );
  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (user.length > 0) {
    data.updated_at = new Date();
    data.created_at = new Date();
    await updateDoc(doc(firestore, "users", user[0].id), data);
    return user[0];
  }
};

export const updateUser = async (data: { username: string; role: string }) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", data.username)
  );
  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (users.length > 0) {
    try {
      await updateDoc(doc(firestore, "users", users[0].id), {
        role: data.role,
      });
      return { status: true };
    } catch (error) {
      return { status: false };
    }
  }
};

export const deleteUser = async (username: string) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username)
  );
  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  try {
    await deleteDoc(doc(firestore, "users", users[0].id));
    return true;
  } catch (error) {
    return false;
  }
};

export const updateDataProfile = async (newDataProfile: {
  username: string;
  newUsername: string;
  phone: number;
}) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", newDataProfile.username)
  );
  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  try {
    await updateDoc(doc(firestore, "users", users[0].id), {
      username: newDataProfile.newUsername,
      phone: newDataProfile.phone,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const changePassword = async (
  username: string,
  password: { oldPassword: string; newPassword: string }
) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username)
  );
  const snapshot = await getDocs(q);
  const users: any = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const fixPassword = await hash(password.newPassword, 10);
  const cekPassword = await compare(password.oldPassword, users[0].password);
  if (cekPassword) {
    await updateDoc(doc(firestore, "users", users[0].id), {
      password: fixPassword,
    });
    return true;
  } else {
    return false;
  }
};

//    STORAGE
export const updateProfile = async (username: string, imageURL: string) => {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username)
  );
  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  try {
    await updateDoc(doc(firestore, "users", users[0].id), {
      image: imageURL,
    });
    return true;
  } catch (err) {
    return false;
  }
};
