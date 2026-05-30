import axiosClient from "../api/axiosClient";

const API = "/driver-work-logs";

export const driverWorkLogService = {

  getAll: async () => {

    const res = await axiosClient.get(API);

    return res.data;
  },
};