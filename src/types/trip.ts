export interface Trip {
  id: number;
  tripCode: string;

  vehicleId: number;
  plateNumber: string;

  driverId: number;
  driverName: string;

  departureTime: string;
  arrivalTime: string | null;

  status: string;
}