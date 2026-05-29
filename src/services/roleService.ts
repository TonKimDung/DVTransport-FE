import axiosClient from "../api/axiosClient";
import type { Role } from "../types/role";

export const roleService = {
  getAll: async (): Promise<Role[]> => {
    const res = await axiosClient.get("/roles");
    return res.data;
  },
};