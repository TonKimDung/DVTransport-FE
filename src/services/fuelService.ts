import axiosClient from "../api/axiosClient";
import type {
  FuelTransaction,
  FuelTransactionRequest,
} from "../types/fuel";

export const fuelService = {
  getAll: async (): Promise<FuelTransaction[]> => {
    const res = await axiosClient.get("/fuel-transactions");
    return res.data;
  },

  getById: async (id: number): Promise<FuelTransaction> => {
    const res = await axiosClient.get(`/fuel-transactions/${id}`);
    return res.data;
  },

  getByVehicleId: async (
    vehicleId: number
  ): Promise<FuelTransaction[]> => {
    const res = await axiosClient.get(
      `/fuel-transactions/vehicle/${vehicleId}`
    );
    return res.data;
  },

  getHistory: async (): Promise<FuelTransaction[]> => {
    const res = await axiosClient.get("/fuel-transactions/history");
    return res.data;
  },

  getConsumptionByVehicle: async (vehicleId: number) => {
    const res = await axiosClient.get(
      `/fuel-transactions/consumption/vehicle/${vehicleId}`
    );
    return res.data;
  },

  create: async (
    data: FuelTransactionRequest
  ): Promise<FuelTransaction> => {
    const res = await axiosClient.post(
      "/fuel-transactions",
      data
    );
    return res.data;
  },

  update: async (
    id: number,
    data: FuelTransactionRequest
  ): Promise<FuelTransaction> => {
    const res = await axiosClient.put(
      `/fuel-transactions/${id}`,
      data
    );
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/fuel-transactions/${id}`);
  },
};