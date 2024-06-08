export interface UserData {
  email: string;
  username?: string;
  name?: string;
  phone: string;
  password: string;
  role?: string;
}

export interface UserGoogle {
  name: string;
  email: string;
  gender: string;
  image?: string;
  role: string;
  login: string;
  [key: string]: any;
}
