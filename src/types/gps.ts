export interface GpsDTO {
  tripId: number;
  vehicleId: number;
  lat: number;
  lng: number;
  time: string;
  speed: number;
  distanceKm: number;
}

export interface GpsHistoryDTO {
  id: number;
  tripId: number;
  vehicleId: number;
  lat: number;
  lng: number;
  recordedAt: string;
}

export interface AlertDTO {
  type: string;
  tripId: number;
  message: string;
  createdAt: string;
}