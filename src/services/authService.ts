import axiosClient from "../api/axiosClient";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosClient.post("/auth/login", data);
    return res.data;
  },
};