// src/services/customerService.ts

import axiosClient from "../api/axiosClient";

import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types/customer";

export const customerService = {

  // =========================
  // CREATE
  // =========================

  create: async (
    data: CreateCustomerRequest
  ) => {

    const res =
      await axiosClient.post(
        "/customers",
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
        "/customers"
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
        `/customers/${id}`
      );

    return res.data;
  },

      async getAvailableContract() {
        const res =
          await axiosClient.get(
            "/customers/available-contract"
          );

        return res.data;
      },
  // =========================
  // UPDATE
  // =========================

  update: async (
    id: number,
    data: UpdateCustomerRequest
  ) => {

    const res =
      await axiosClient.put(
        `/customers/${id}`,
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
        `/customers/${id}`
      );

    return res.data;
  },
};