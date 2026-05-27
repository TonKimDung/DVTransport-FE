import axiosClient from "../api/axiosClient";
import type {
  DriverLicense,
  DriverLicenseRequest,
} from "../types/driverLicense";

export const driverLicenseService = {
  getAll: async (): Promise<DriverLicense[]> => {
    const res = await axiosClient.get("/driver-licenses");
    return res.data;
  },

  getById: async (id: number): Promise<DriverLicense> => {
    const res = await axiosClient.get(`/driver-licenses/${id}`);
    return res.data;
  },

  getByDriver: async (driverId: number): Promise<DriverLicense[]> => {
    const res = await axiosClient.get(`/driver-licenses/driver/${driverId}`);
    return res.data;
  },

  create: async (body: DriverLicenseRequest): Promise<DriverLicense> => {
    const res = await axiosClient.post("/driver-licenses", body);
    return res.data;
  },

  update: async (
    id: number,
    body: DriverLicenseRequest
  ): Promise<DriverLicense> => {
    const res = await axiosClient.put(`/driver-licenses/${id}`, body);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/driver-licenses/${id}`);
  },
};