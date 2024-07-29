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
import { AlamatBaru, GoogleUser, UserData, UserGoogle } from "./interface";

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

export const retriveProducts = async () => {
  const snapshot = await getDocs(collection(firestore, "products"));
  const data = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return data;
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

export const addAddress = async (
  tambahALamatBaru: AlamatBaru,
  userID: string
) => {
  try {
    const snapshot = await getDoc(doc(firestore, "users", userID));
    const user: any = snapshot.data();
    if (user.address) {
      tambahALamatBaru.isMain = false;
      await updateDoc(doc(firestore, "users", userID), {
        address: [...user.address, tambahALamatBaru],
      });
    } else {
      tambahALamatBaru.isMain = true;
      await updateDoc(doc(firestore, "users", userID), {
        address: [tambahALamatBaru],
      });
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const updateAddress = async (
  userID: string,
  newAllAddress: any
) => {
  try {
    await updateDoc(doc(firestore, "users", userID), {
      address: newAllAddress
    })
    return true;
  } catch (err) {
    console.log("ada error",err);
    return false;
  }
}

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
  email: string,
  password: { oldPassword: string; newPassword: string }
) => {
  const q = query(collection(firestore, "users"), where("email", "==", email));
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

// Products
export const addProduct = async (data: any) => {
  try {
    const docRef = await addDoc(collection(firestore, "products"), data);
    return docRef.id;
  } catch (err) {
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

export const updateProductImage = async (data: {
  imageUrl: string;
  productID: string;
}) => {
  try {
    await updateDoc(doc(firestore, "products", data.productID), {
      image: data.imageUrl,
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const updateProduct = async (data: {
  productID: string;
  product: any;
}) => {
  try {
    await updateDoc(doc(firestore, "products", data.productID), data.product);
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteProduct = async (productID: string) => {
  try {
    await deleteDoc(doc(firestore, "products", productID));
    return true;
  } catch (err) {
    return false;
  }
};

// HANDLE CART
export const addToCart = async (
  data: { productID: string; size: string; qwt: string },
  userID: string
) => {
  const snapshot = await getDoc(doc(firestore, "users", userID));
  const cart: any = snapshot.data();
  if (cart.cart) {
    const check: any = cart.cart.find((item: any) => item.size === data.size);
    const check2: any = cart.cart.find(
      (item: any) => item.productID === data.productID
    );
    if (check && check2) {
      await updateDoc(doc(firestore, "users", userID), {
        cart: cart.cart.map((item: any) => {
          if (item.size === data.size && item.productID === data.productID) {
            return { ...item, qwt: parseInt(item.qwt) + parseInt(data.qwt) };
          } else {
            return item;
          }
        }),
      });
    } else {
      await updateDoc(doc(firestore, "users", userID), {
        cart: [...cart.cart, data],
      });
    }
    return true;
  } else {
    await updateDoc(doc(firestore, "users", userID), {
      cart: [data],
    });
    return true;
  }
};

export const getCarts: any = async (userID: string) => {
  try {
    console.log("masuk kesini");
    console.log(userID);
    const snapshot = await getDoc(doc(firestore, "users", userID));
    const user: any = snapshot.data();
    if (user.cart) {
      return { status: true, cart: user.cart };
    } else return "kosong";
  } catch (err) {
    return false;
  }
};

export const cartDelete = (data: {
  userID: string;
  newCarts: { productID: string; qwt: number; size: string }[];
}) => {
  try {
    updateDoc(doc(firestore, "users", data.userID), {
      cart: data.newCarts,
    });
    return true;
  } catch (err) {
    return false;
  }
};
