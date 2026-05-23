import axiosClient from "../api/axiosClient";
import type { Assignment } from "../types/assignment";

export const assignmentService = {
  async getAll(): Promise<
    Assignment[]
  > {
    const res =
      await axiosClient.get(
        "/driver-assignments"
      );

    return res.data;
  },

  async create(
    data: {
      driverId: number;
      vehicleId: number;
      assignedDate: string;
    }
  ) {
    const res =
      await axiosClient.post(
        "/driver-assignments",
        data
      );

    return res.data;
  },

  async deactivate(
    id: number
  ) {
    const res =
      await axiosClient.put(
        `/driver-assignments/${id}/deactivate`
      );

    return res.data;
  },

  async getWork(
    driverId: number
  ) {
    const res =
      await axiosClient.get(
        `/driver-assignments/driver/${driverId}/work`
      );

    return res.data;
  },
};