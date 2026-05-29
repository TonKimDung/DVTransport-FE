export interface DriverLicense {
  id: number;
  driverId: number;
  driverName: string;
  licenseNumber: string;
  licenseClass: string;
  issueDate: string;
  expiryDate: string;
  fileUrl: string;
  status: string;
  createdAt: string;
}

export interface DriverLicenseRequest {
  driverId: number;
  licenseNumber: string;
  licenseClass: string;
  issueDate: string;
  expiryDate: string;
  fileUrl: string;
  status: string;
}