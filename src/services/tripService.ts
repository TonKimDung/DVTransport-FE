import axiosClient from "../api/axiosClient";

export const tripService = {
  getAll: async () => {
    const res = await axiosClient.get("/trips");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await axiosClient.get(`/trips/${id}`);
    return res.data;
  },

  // FIX ENDPOINT
  getPendingOrders: async (routeId: number) => {
    const res = await axiosClient.get(
      `/trips/route/${routeId}/orders`
    );

    return res.data;
  },

  // FIX ENDPOINT
  suggestVehicles: async (
    routeId: number
  ) => {
    const res = await axiosClient.get(
      `/trips/route/${routeId}/vehicles`
    );

    return res.data;
  },

  create: async (data: any) => {
    const res = await axiosClient.post(
      "/trips",
      data
    );

    return res.data;
  },
};