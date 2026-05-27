export interface Payroll {
  id: number;
  driverId: number;
  driverName: string;
  month: number;
  year: number;
  baseSalary: number;
  completedTrips: number;
  bonusAmount: number;
  penaltyAmount: number;
  totalSalary: number;
  status: string;
  note?: string;
  createdAt?: string;
}

export interface PayrollCalculateRequest {
  driverId: number;
  month: number;
  year: number;
  bonusAmount: number;
  penaltyAmount: number;
}