import axiosClient from "../api/axiosClient";
import type { Order, OrderRequest } from "../types/order";
import type { Vehicle } from "../types/vehicle";

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await axiosClient.get("/orders");
    return res.data;
  },

  getById: async (id: number): Promise<Order> => {
    const res = await axiosClient.get(`/orders/${id}`);
    return res.data;
  },

  create: async (data: OrderRequest): Promise<Order> => {
    const res = await axiosClient.post("/orders", data);
    return res.data;
  },

  update: async (id: number, data: OrderRequest): Promise<Order> => {
    const res = await axiosClient.put(`/orders/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const res = await axiosClient.patch(`/orders/${id}/status`, null, {
      params: { status },
    });
    return res.data;
  },

  suggestVehicles: async (id: number): Promise<Vehicle[]> => {
    const res = await axiosClient.get(`/orders/${id}/suggest-vehicles`);
    return res.data;
  },

  getDailyPlan: async (date: string): Promise<Order[]> => {
    const res = await axiosClient.get("/orders/plan/day", {
      params: { date },
    });
    return res.data;
  },

  getWeeklyPlan: async (startDate: string): Promise<Order[]> => {
    const res = await axiosClient.get("/orders/plan/week", {
      params: { startDate },
    });
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/orders/${id}`);
  },
};