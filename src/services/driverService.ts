import axiosClient from "../api/axiosClient";
import type { Driver } from "../types/driver";

export const driverService = {
  getAll: async (): Promise<Driver[]> => {
    const res = await axiosClient.get("/drivers");
    return res.data;
  },

  getById: async (id: number): Promise<Driver> => {
    const res = await axiosClient.get(`/drivers/${id}`);
    return res.data;
  },
};