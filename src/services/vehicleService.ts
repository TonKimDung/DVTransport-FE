import axios from "axios";
import type { Vehicle, VehicleRequest } from "../types/vehicle";

const API_URL = "http://localhost:8080/api/vehicles";

export const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: number): Promise<Vehicle> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: VehicleRequest): Promise<Vehicle> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  update: async (
    id: number,
    data: VehicleRequest
  ): Promise<Vehicle> => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};