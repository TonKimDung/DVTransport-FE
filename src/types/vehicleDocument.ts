export interface VehicleDocument {
  id: number;
  vehicleId: number;
  plateNumber: string;
  documentType: string;
  documentName: string;
  fileUrl: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  createdAt: string;
}

export interface VehicleDocumentRequest {
  vehicleId: number;
  documentType: string;
  documentName: string;
  fileUrl: string;
  issueDate: string;
  expiryDate: string;
  status: string;
}