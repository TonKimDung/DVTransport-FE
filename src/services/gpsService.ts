import axiosClient from "../api/axiosClient";

export const gpsService = {
  getHistory: async (tripId: number) => {
    const res = await axiosClient.get(
      `/gps/history/${tripId}`
    );

    return res.data;
  },
};