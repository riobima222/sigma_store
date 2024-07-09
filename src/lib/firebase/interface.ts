export interface UserData {
  email: string;
  username?: string;
  name?: string;
  phone: string;
  image?: string;
  password: string;
  role?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserGoogle {
  username: string;
  email: string;
  image?: string;
  role: string;
  login: string;
  [key: string]: any;
}

export interface GoogleUser {
  username: string;
  email: string;
  image: string;
  role: string;
  login: string;
}
