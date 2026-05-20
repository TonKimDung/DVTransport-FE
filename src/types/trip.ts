// src/types/trip.ts

export interface Trip {
  id: number;

  tripCode: string;

  vehicleId: number;

  plateNumber: string;

  driverId: number;

  driverName: string;

  routeName?: string;

  departureTime: string;

  arrivalTime?: string;

  status: string;
}

export interface CreateTripRequest {
  routeId: number;

  vehicleId: number;

  orderIds: number[];

  departureTime: string;
}

export interface VehicleSuggestion {
  vehicleId: number;

  plateNumber: string;

  vehicleType: string;

  capacity: number;

  currentLocation: string;

  driverName: string;
}