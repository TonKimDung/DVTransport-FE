import axiosClient from "../api/axiosClient";
import type { Incident, IncidentRequest } from "../types/incident";

export const incidentService = {
  getAll: async (): Promise<Incident[]> => {
    const res = await axiosClient.get("/incidents");
    return res.data;
  },

  create: async (data: IncidentRequest): Promise<Incident> => {
    const res = await axiosClient.post("/incidents", data);
    return res.data;
  },

  updateStatus: async (id: number, status: string): Promise<Incident> => {
    const res = await axiosClient.patch(`/incidents/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  },
};