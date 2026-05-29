import axiosClient from "../api/axiosClient";
import type { User, UserRequest, UserLog } from "../types/user";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await axiosClient.get("/users");
    return res.data;
  },

  create: async (data: UserRequest): Promise<User> => {
    const res = await axiosClient.post("/users", data);
    return res.data;
  },

  update: async (id: number, data: UserRequest): Promise<User> => {
    const res = await axiosClient.put(`/users/${id}`, data);
    return res.data;
  },

  lock: async (id: number): Promise<User> => {
    const res = await axiosClient.patch(`/users/${id}/lock`);
    return res.data;
  },

  unlock: async (id: number): Promise<User> => {
    const res = await axiosClient.patch(`/users/${id}/unlock`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/users/${id}`);
  },

  getAllUserLogs: async (): Promise<UserLog[]> => {
    const res = await axiosClient.get("/users/logs");
    return res.data;
  },

  getUserLogsByUserId: (userId: number) => {
    return axiosClient.get<UserLog[]>(`/users/${userId}/logs`);
  },
};