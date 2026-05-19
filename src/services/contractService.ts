import axiosClient from "../api/axiosClient";
import type { Contract } from "../types/contract";

export const contractService = {
  getAll: async (): Promise<Contract[]> => {
    const res = await axiosClient.get("/contracts");
    return res.data;
  },
};