export interface Order {
  id: number;
  orderCode: string;

  customerId: number;
  customerName: string;

  contractId?: number | null;
  routeId?: number | null;
  routeName?: string;

  cargoType: string;
  weight: number;
  quantity: number;

  pickupAddress: string;
  deliveryAddress: string;

  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderRequest {
  orderCode: string;
  customerId: number;
  contractId?: number | null;
  routeId?: number | null;
  cargoType: string;
  weight: number;
  quantity: number;
  pickupAddress: string;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
}