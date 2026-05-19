export interface Contract {
  id: number;
  contractNumber: string;
  contractType: string | null;
  customerName: string | null;
  partnerName: string | null;
  startDate: string;
  endDate: string;
  totalValue: number;
  status: string;
}