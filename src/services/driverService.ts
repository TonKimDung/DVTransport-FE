import axiosClient from "../api/axiosClient";

import type {
  Driver,
  CreateDriverRequest,
  UpdateDriverRequest,
} from "../types/driver";

const BASE_URL =
  "/drivers";

export const driverService =
  {
    getAll: async (): Promise<
      Driver[]
    > => {
      const res =
        await axiosClient.get(
          BASE_URL
        );

      return res.data;
    },

    getById: async (
      id: number
    ): Promise<Driver> => {
      const res =
        await axiosClient.get(
          `${BASE_URL}/${id}`
        );

      return res.data;
    },

    create: async (
      data: CreateDriverRequest
    ): Promise<Driver> => {
      const res =
        await axiosClient.post(
          BASE_URL,
          data
        );

      return res.data;
    },

    update: async (
      id: number,
      data: UpdateDriverRequest
    ): Promise<Driver> => {
      const res =
        await axiosClient.put(
          `${BASE_URL}/${id}`,
          data
        );

      return res.data;
    },

    delete: async (
      id: number
    ): Promise<void> => {
      await axiosClient.delete(
        `${BASE_URL}/${id}`
      );
    },

    updateStatus:
      async (
        id: number,
        status: string
      ): Promise<Driver> => {
        const res =
          await axiosClient.put(
            `${BASE_URL}/${id}/status`,
            null,
            {
              params: {
                status,
              },
            }
          );

        return res.data;
      },

      async getAvailable() {
        const res =
          await axiosClient.get(
            "/drivers/available"
          );

        return res.data;
      },
  };