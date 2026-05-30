// src/types/contract.ts

export interface Contract {
  id: number;

  contractNumber: string;

  contractType: string;

  customerId?: number;
  customerName?: string;

  partnerId?: number;
  partnerName?: string;

  driverId?: number;
  driverName?: string;

  driverLicenseId?: number;
  licenseClass?: string;

  baseSalary?: number;

  totalValue?: number;

  startDate: string;

  endDate: string;

  status: string;

  createdAt?: string;
}

export interface CreateContractRequest {
  contractNumber: string;

  contractType: string;

  customerId?: number | null;

  partnerId?: number | null;

  driverId?: number | null;

  driverLicenseId?: number | null;

  baseSalary?: number | null;

  totalValue?: number | null;

  startDate: string;

  endDate: string;

  status: string;
}

export interface UpdateContractRequest
  extends CreateContractRequest {}