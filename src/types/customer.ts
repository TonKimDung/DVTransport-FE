// src/types/customer.ts

export interface Customer {

  id: number;

  name: string;

  phone?: string;

  email?: string;

  address?: string;

  status?: string;
}

export interface CreateCustomerRequest {

  name: string;

  phone?: string;

  email?: string;

  address?: string;

  status?: string;
}

export interface UpdateCustomerRequest
  extends CreateCustomerRequest {}