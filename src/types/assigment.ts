export interface Assignment {
  id: number;

  vehicleId: number;
  plateNumber: string;

  driverId: number;
  driverName: string;

  assignedDate: string;

  status: string;
}

export interface AssignDriverRequest {
  vehicleId: number;
  driverId: number;
  assignedDate: string;
}

export interface DriverWorkResponse {
  driverId: number;
  totalHours: number;
  overworked: boolean;
}