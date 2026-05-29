// src/types/partner.ts

export interface Partner {

  id: number;

  name: string;

  phone?: string;

  email?: string;

  address?: string;

  status?: string;
}

export interface CreatePartnerRequest {

  name: string;

  phone?: string;

  email?: string;

  address?: string;

  status?: string;
}

export interface UpdatePartnerRequest
  extends CreatePartnerRequest {}