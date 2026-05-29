import axiosClient from "../api/axiosClient";
import type { Payroll, PayrollCalculateRequest } from "../types/payroll";

export const payrollService = {
  calculate: async (body: PayrollCalculateRequest): Promise<Payroll> => {
    const res = await axiosClient.post("/payrolls/calculate", body);
    return res.data;
  },

  getMonthly: async (month: number, year: number): Promise<Payroll[]> => {
  const res = await axiosClient.get("/payrolls/monthly", {
    params: { month, year },
  });
  return res.data;
},

  getByDriver: async (driverId: number): Promise<Payroll[]> => {
    const res = await axiosClient.get(`/payrolls/driver/${driverId}`);
    return res.data;
  },
};