import { api } from "./client";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  password: string;
}

export const AuthAPI = {
  login(data: LoginDTO) {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register(data: RegisterDTO) {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  profile() {
    return api("/users/me");
  },
};