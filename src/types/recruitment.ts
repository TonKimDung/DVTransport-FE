export interface RecruitmentCampaign {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface RecruitmentCampaignRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface JobApplication {
  id: number;

  fullName: string;
  phone: string;
  email: string;
  address: string;

  experienceYears: number;
  status: string;
  createdAt: string;

  campaignId: number;
  campaignName: string;
}

export interface JobApplicationRequest {
  campaignId: number;

  fullName: string;
  phone: string;
  email: string;
  address: string;

  experienceYears: number;
  status: string;
}