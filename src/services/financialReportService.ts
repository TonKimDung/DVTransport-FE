import axiosClient from "../api/axiosClient";

export interface FinancialReport {
  month: number;
  year: number;

  totalFuelCost: number;
  totalTripExpense: number;
  totalPayroll: number;
  totalCost: number;

  totalRevenue: number;
  profit: number;
}

export const financialReportService = {
  async getMonthlyReport(
    month: number,
    year: number
  ): Promise<FinancialReport> {
    const response = await axiosClient.get(
      "/financial-reports/monthly",
      {
        params: {
          month,
          year,
        },
      }
    );

    return response.data;
  },
};