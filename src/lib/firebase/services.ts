import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

// Interface
import { UserData } from "./interface";

const firestore = getFirestore(app);

export const retriveData = async (collectionName: string) => {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return data;
};

export const retriveDataByID = async (collectionName: string, id: string) => {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
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
    console.log(`data sudah ada`);
    return { code: 400, status: false };
  } else {
    userData.role = "member";
    userData.password = await bcrypt.hash(userData.password, 10);
    try {
      await addDoc(collection(firestore, "users"), userData);
      return { code: 200, status: true };
    } catch (error) {
      return { code: 500, status: false };
    }
  }
};
