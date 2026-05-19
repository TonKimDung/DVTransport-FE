import axiosClient from "../api/axiosClient";
import type { RouteItem } from "../types/route";

export const routeService = {
  getAll: async (): Promise<RouteItem[]> => {
    const res = await axiosClient.get("/routes");
    return res.data;
  },
};