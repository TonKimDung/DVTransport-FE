// src/services/contractService.ts

import axiosClient from "../api/axiosClient";

import type {
  CreateContractRequest,
  UpdateContractRequest,
} from "../types/contract";

export const contractService = {

  // =========================
  // CREATE
  // =========================

  create: async (
    data: CreateContractRequest
  ) => {

    const payload = {
      ...data,

      customerId:
        data.customerId || null,

      partnerId:
        data.partnerId || null,

      driverId:
        data.driverId || null,

      totalValue:
        data.totalValue || null,
    };

    const res =
      await axiosClient.post(
        "/contracts",
        payload
      );

    return res.data;
  },

  // =========================
  // GET ALL
  // =========================

  getAll: async () => {

    const res =
      await axiosClient.get(
        "/contracts"
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
        `/contracts/${id}`
      );

    return res.data;
  },

  // =========================
  // UPDATE
  // =========================

  update: async (
    id: number,
    data: UpdateContractRequest
  ) => {

    const payload = {
      ...data,

      customerId:
        data.customerId || null,

      partnerId:
        data.partnerId || null,

      driverId:
        data.driverId || null,

      driverLicenseId:
        data.driverLicenseId || null,

      totalValue:
        data.totalValue || null,

      baseSalary:
        data.baseSalary || null,
    };

    const res =
      await axiosClient.put(
        `/contracts/${id}`,
        payload
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
        `/contracts/${id}`
      );

    return res.data;
  },
};