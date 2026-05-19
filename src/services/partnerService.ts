import axiosClient from "../api/axiosClient";
import type { Partner } from "../types/partner";

export const partnerService = {
  getAll: async (): Promise<Partner[]> => {
    const res = await axiosClient.get("/partners");
    return res.data;
  },

  getById: async (id: number): Promise<Partner> => {
    const res = await axiosClient.get(`/partners/${id}`);
    return res.data;
  },
};