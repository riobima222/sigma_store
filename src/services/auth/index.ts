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
  updateUser(data: { username: string; role: string }, token: string) {
    return instance.put("/api/user/updateuser", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteUser(username: string, token: string) {
    return instance.delete(`/api/user/deleteuser/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getProfile(token: string) {
    return instance.get("/api/user/getprofile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateProfile(token: string, imageURL: { imageURL: string }) {
    return instance.put(`/api/user/updateprofile/`, imageURL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateDataProfile(
    token: string,
    newDataUpdate: { username: string; newUsername: string; phone: number }
  ) {
    return instance.put("/api/user/updatedataprofile", newDataUpdate, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  changePassword(
    token: string,
    data: { oldPassword: string; newPassword: string }
  ) {
    return instance.put("/api/user/changepassword", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const productsServices = {
  getAllProducts() {
    return instance.get("/api/product/getproducts");
  }
}
