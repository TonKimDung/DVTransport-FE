import axiosClient from "../api/axiosClient";

import type {
  RecruitmentCampaign,
  RecruitmentCampaignRequest,
  JobApplication,
  JobApplicationRequest,
} from "../types/recruitment";
import type { ApplicationStatus } from "../types/status/applicationStatus";

export const recruitmentService = {
  // ================= CAMPAIGN =================

  getCampaigns: async (): Promise<RecruitmentCampaign[]> => {
    const res = await axiosClient.get(
      "/recruitment-campaigns"
    );

    return res.data;
  },

  createCampaign: async (
    data: RecruitmentCampaignRequest
  ): Promise<RecruitmentCampaign> => {
    const res = await axiosClient.post(
      "/recruitment-campaigns",
      data
    );

    return res.data;
  },

  updateCampaign: async (
    id: number,
    data: RecruitmentCampaignRequest
  ): Promise<RecruitmentCampaign> => {
    const res = await axiosClient.put(
      `/recruitment-campaigns/${id}`,
      data
    );

    return res.data;
  },

  deleteCampaign: async (
    id: number
  ): Promise<void> => {
    await axiosClient.delete(
      `/recruitment-campaigns/${id}`
    );
  },

  closeCampaign: async (
    id: number
  ): Promise<RecruitmentCampaign> => {
    const res = await axiosClient.put(
      `/recruitment-campaigns/${id}/close`
    );

    return res.data;
  },

  // ================= APPLICATION =================

  getApplications:
    async (): Promise<JobApplication[]> => {
      const res =
        await axiosClient.get(
          "/job-applications"
        );

      return res.data;
    },

  getApplicationsByCampaign:
    async (
      campaignId: number
    ): Promise<JobApplication[]> => {
      const res =
        await axiosClient.get(
          `/job-applications/campaign/${campaignId}`
        );

      return res.data;
    },

  createApplication: async (
    data: JobApplicationRequest
  ): Promise<JobApplication> => {
    const res =
      await axiosClient.post(
        "/job-applications",
        data
      );

    return res.data;
  },

  updateApplication: async (
    id: number,
    data: JobApplicationRequest
  ): Promise<JobApplication> => {
    const res =
      await axiosClient.put(
        `/job-applications/${id}`,
        data
      );

    return res.data;
  },

  deleteApplication: async (
    id: number
  ): Promise<void> => {
    await axiosClient.delete(
      `/job-applications/${id}`
    );
  },

  updateApplicationStatus:
  async (
    id: number,
    status: ApplicationStatus
  ): Promise<JobApplication> => {

    const res =
      await axiosClient.put(
        `/job-applications/${id}/status`,
        null,
        {
          params: {
            status,
          },
        }
      );

    return res.data;
  },
};