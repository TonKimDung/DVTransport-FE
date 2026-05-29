// src/services/partnerService.ts

import axiosClient from "../api/axiosClient";

import type {
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from "../types/partner";

export const partnerService = {

  // =========================
  // CREATE
  // =========================

  create: async (
    data: CreatePartnerRequest
  ) => {

    const res =
      await axiosClient.post(
        "/partners",
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
        "/partners"
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
        `/partners/${id}`
      );

    return res.data;
  },

  // =========================
  // UPDATE
  // =========================

  update: async (
    id: number,
    data: UpdatePartnerRequest
  ) => {

    const res =
      await axiosClient.put(
        `/partners/${id}`,
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
        `/partners/${id}`
      );

    return res.data;
  },

      async getAvailableContract() {
        const res =
          await axiosClient.get(
            "/partners/available-contract"
          );

        return res.data;
      },
};