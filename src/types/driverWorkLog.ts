export interface DriverWorkLog {

  id: number;

  driverId: number;

  driverName: string;

  tripId: number;

  tripCode: string;

  workDate: string;

  drivingHours: number;

  tripCount: number;

  overtime: boolean;

  warningLevel: string;

  warningMessage: string;

  realtime?: boolean;
}