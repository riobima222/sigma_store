import instance from "@/lib/axios/instance";

export const authServices = {
  registerAccount(data: any) {
    return instance.post("/api/user/register", data);
  },
};
export const dataServices = {
  getAllData() {
    return instance.get("/api/user/getall");
  },
};

export const userServices = {
  updateUser(data: { username: string; role: string }) {
    return instance.put("/api/user/updateuser", data);
  },
  deleteUser(username: string) {
    return instance.delete(`/api/user/deleteuser/${username}`);
  },
  getProfile() {
    return instance.get("/api/user/getprofile");
  },
  updateProfile(imageURL: { imageURL: string }) {
    return instance.put(`/api/user/updateprofile/`, imageURL);
  },
  updateDataProfile(newDataUpdate: {
    username: string;
    newUsername: string;
    phone: number;
  }) {
    return instance.put("/api/user/updatedataprofile", newDataUpdate);
  },
  changePassword(data: { oldPassword: string; newPassword: string }) {
    return instance.put("/api/user/changepassword", data);
  },
  addAddress(data: {
    recipient: string;
    addressLine: string;
    phone: string;
    note: string;
  }) {
    return instance.put("/api/user/addaddress", data);
  },
  updateAddress(data: any) {
    return instance.put("/api/user/updateaddress", data);
  },
};

export const productsServices = {
  getAllProducts() {
    return instance.get("/api/product/getproducts");
  },
  addProduct(data: {
    name: string;
    price: number;
    image: any;
    category: string;
    status: string;
    stock: { size: string; qwt: string }[];
  }) {
    return instance.put("/api/product/addproduct", data);
  },
  updateProductImage(data: { imageUrl: string; productID: string }) {
    return instance.put("/api/product/updateproductimage", data);
  },
  updateProduct(data: any) {
    return instance.put("/api/product/updateproduct", data);
  },
  deleteProduct(productID: string) {
    return instance.delete(`/api/product/deleteproduct/${productID}`);
  },
  getOneProduct(id: string) {
    return instance.get("/api/product/getoneproduct/" + id);
  },
};

export const cartServices = {
  addToCart(data: any) {
    return instance.post("/api/cart", data);
  },
  getCarts() {
    return instance.get("/api/cart");
  },
  deleteCart(data: any) {
    return instance.put(`/api/cart`, data);
  },
};
