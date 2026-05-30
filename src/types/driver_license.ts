export interface DriverLicense {

  id: number;

  driverId: number;

  driverName: string;

  licenseNumber: string;

  licenseClass: string;

  baseSalary: number;

  issueDate: string;

  expiryDate: string;

  status: string;

  createdAt: string;
}

export interface CreateDriverLicenseRequest {

  driverId: number;

  licenseNumber: string;

  licenseClass: string;

  issueDate: string;

  expiryDate: string;

  status: string;
}

export interface UpdateDriverLicenseRequest {

  licenseClass: string;

  issueDate: string;

  expiryDate: string;

  status: string;
}
