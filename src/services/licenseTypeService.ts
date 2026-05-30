// src/services/licenseTypeService.ts

import axiosClient from "../api/axiosClient";

import type {
  LicenseType,
  CreateLicenseTypeRequest,
  UpdateLicenseTypeRequest,
} from "../types/licenseType";

export const licenseTypeService = {

  // =========================
  // GET ALL
  // =========================

  async getAll(): Promise<LicenseType[]> {

    const res =
      await axiosClient.get(
        "/license-types"
      );

    return res.data;
  },

  // =========================
  // GET BY ID
  // =========================

  async getById(
    id: number
  ): Promise<LicenseType> {

    const res =
      await axiosClient.get(
        `/license-types/${id}`
      );

    return res.data;
  },

  // =========================
  // CREATE
  // =========================

  async create(
    data:
      CreateLicenseTypeRequest
  ): Promise<LicenseType> {

    const res =
      await axiosClient.post(
        "/license-types",
        data
      );

    return res.data;
  },

  // =========================
  // UPDATE
  // =========================

  async update(
    id: number,
    data:
      UpdateLicenseTypeRequest
  ): Promise<LicenseType> {

    const res =
      await axiosClient.put(
        `/license-types/${id}`,
        data
      );

    return res.data;
  },

  // =========================
  // DELETE
  // =========================

  async delete(
    id: number
  ): Promise<void> {

    await axiosClient.delete(
      `/license-types/${id}`
    );
  },
};