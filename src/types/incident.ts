export interface Incident {
  id: number;
  tripId?: number | null;
  vehicleId: number;
  plateNumber?: string;
  driverId: number;
  driverName?: string;
  incidentType: string;
  description: string;
  incidentTime: string;
  status: string;
  createdAt?: string;
}

export interface IncidentRequest {
  tripId?: number | null;
  vehicleId: number;
  driverId: number;
  incidentType: string;
  description: string;
  incidentTime: string;
  status: string;
}