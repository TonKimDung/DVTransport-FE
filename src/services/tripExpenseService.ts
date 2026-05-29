import axiosClient from "../api/axiosClient";
import type { TripExpense } from "../types/tripExpense";

export const tripExpenseService = {
  getAll: async (): Promise<TripExpense[]> => {
    const res = await axiosClient.get("/trip-expenses");
    return res.data;
  },
};