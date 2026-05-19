import axiosClient from "../api/axiosClient";
import type { Trip } from "../types/trip";

export const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const res = await axiosClient.get("/trips");
    return res.data;
  },

  getById: async (id: number): Promise<Trip> => {
    const res = await axiosClient.get(`/trips/${id}`);
    return res.data;
  },
};