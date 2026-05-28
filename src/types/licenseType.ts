// src/types/licenseType.ts

export interface LicenseType {

  id: number;

  licenseClass: string;

  baseSalary: number;
}

export interface CreateLicenseTypeRequest {

  licenseClass: string;

  baseSalary: number;
}

export interface UpdateLicenseTypeRequest {

  licenseClass: string;

  baseSalary: number;
}