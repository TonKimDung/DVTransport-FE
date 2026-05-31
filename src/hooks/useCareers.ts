import { useEffect, useState } from "react";
import { recruitmentService } from "../services/recruitmentService";

import type {
  RecruitmentCampaign,
} from "../types/recruitment";

export default function useCareers() {
  const [loading, setLoading] =
    useState(true);

  const [campaigns, setCampaigns] =
    useState<RecruitmentCampaign[]>([]);

  const [selectedJob, setSelectedJob] =
    useState<RecruitmentCampaign | null>(
      null
    );

  const loadCampaigns =
    async () => {
      try {
        setLoading(true);

        const data =
          await recruitmentService.getCampaigns();

        setCampaigns(
          data.filter(
            (i) =>
              i.status !== "CLOSED"
          )
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    loading,
    campaigns,
    selectedJob,
    setSelectedJob,
    reload: loadCampaigns,
  };
}