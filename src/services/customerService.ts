import axiosClient from "../api/axiosClient";
import type { Customer } from "../types/customer";

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const res = await axiosClient.get("/customers");
    return res.data;
  },
};