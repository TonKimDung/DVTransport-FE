export interface Vehicle {
  id: number;
  plateNumber: string;
  vehicleType: string;
  capacity: number;
  status: string;
  manufactureYear: number;
  inspectionExpiry: string;
  insuranceExpiry: string;
  createdAt?: string;
}

export interface VehicleRequest {
  plateNumber: string;
  vehicleType: string;
  capacity: number;
  status: string;
  manufactureYear: number;
  inspectionExpiry: string;
  insuranceExpiry: string;
}