export interface Driver {
  id: number;

  fullName: string;
  phone: string;
  email: string;
  address: string;

  licenseNumber: string;
  licenseExpiry: string;

  status: string;
  createdAt: string;
}

export interface CreateDriverRequest {
  fullName: string;
  phone: string;
  email: string;
  address: string;

  licenseNumber: string;
  licenseExpiry: string;
}

export interface UpdateDriverRequest {
  fullName: string;
  phone: string;
  email: string;
  address: string;

  licenseExpiry: string;

  status: string;
}