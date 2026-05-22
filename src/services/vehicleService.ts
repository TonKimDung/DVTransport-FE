import axiosClient from "../api/axiosClient";
import type { Vehicle, VehicleRequest } from "../types/vehicle";

const BASE_PATH = "/vehicles";

export const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await axiosClient.get(BASE_PATH);
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await axiosClient.get(`${BASE_PATH}/${id}`);
    return response.data;
  },

  create: async (data: VehicleRequest): Promise<Vehicle> => {
    const response = await axiosClient.post(BASE_PATH, data);
    return response.data;
  },

  update: async (
    id: number,
    data: VehicleRequest
  ): Promise<Vehicle> => {
    const response = await axiosClient.put(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axiosClient.delete(`${BASE_PATH}/${id}`);
    return response.data; 
  },

  async getAvailable() {
    const res =
      await axiosClient.get(
        "/vehicles/available"
      );

    return res.data;
  }
};