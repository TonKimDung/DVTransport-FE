import axiosClient from "../api/axiosClient";
import type {
  VehicleDocument,
  VehicleDocumentRequest,
} from "../types/vehicleDocument";

export const vehicleDocumentService = {
  getAll: async (): Promise<VehicleDocument[]> => {
    const res = await axiosClient.get("/vehicle-documents");
    return res.data;
  },

  getById: async (id: number): Promise<VehicleDocument> => {
    const res = await axiosClient.get(`/vehicle-documents/${id}`);
    return res.data;
  },

  getByVehicle: async (vehicleId: number): Promise<VehicleDocument[]> => {
    const res = await axiosClient.get(`/vehicle-documents/vehicle/${vehicleId}`);
    return res.data;
  },

  create: async (body: VehicleDocumentRequest): Promise<VehicleDocument> => {
    const res = await axiosClient.post("/vehicle-documents", body);
    return res.data;
  },

  update: async (
    id: number,
    body: VehicleDocumentRequest
  ): Promise<VehicleDocument> => {
    const res = await axiosClient.put(`/vehicle-documents/${id}`, body);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/vehicle-documents/${id}`);
  },
};