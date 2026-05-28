import axiosClient from "../api/axiosClient";
import type { CreateDriverLicenseRequest, UpdateDriverLicenseRequest } from "../types/driver_license";


export const driverLicenseService = {

  // =========================
  // CREATE
  // =========================

  create: async (
    data: CreateDriverLicenseRequest
  ) => {

    const res =
      await axiosClient.post(
        "/driver-licenses",
        data
      );

    return res.data;
  },

  // =========================
  // GET ALL
  // =========================

  getAll: async () => {

    const res =
      await axiosClient.get(
        "/driver-licenses"
      );

    return res.data;
  },

  // =========================
  // GET BY ID
  // =========================

  getById: async (
    id: number
  ) => {

    const res =
      await axiosClient.get(
        `/driver-licenses/${id}`
      );

    return res.data;
  },

  // =========================
  // GET BY DRIVER
  // =========================

  getByDriver: async (
    driverId: number
  ) => {

    const res =
      await axiosClient.get(
        `/driver-licenses/driver/${driverId}`
      );

    return res.data;
  },

  // =========================
  // UPDATE
  // =========================

  update: async (
    id: number,
    data: UpdateDriverLicenseRequest
  ) => {

    const res =
      await axiosClient.put(
        `/driver-licenses/${id}`,
        data
      );

    return res.data;
  },

  // =========================
  // DELETE
  // =========================

  delete: async (
    id: number
  ) => {

    const res =
      await axiosClient.delete(
        `/driver-licenses/${id}`
      );

    return res.data;
  },
};