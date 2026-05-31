import {
  Briefcase,
  LogIn,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import JobCard from "../components/careers/JobCard";
import JobDetail from "../components/careers/JobDetail";
import JobApplicationForm from "../components/careers/JobApplicationForm";

import { recruitmentService } from "../services/recruitmentService";

import type {
  RecruitmentCampaign,
} from "../types/recruitment";

export default function CareersPage() {
  const [
    campaigns,
    setCampaigns,
  ] = useState<
    RecruitmentCampaign[]
  >([]);

  const [
    selectedJob,
    setSelectedJob,
  ] =
    useState<RecruitmentCampaign | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const formRef =
    useRef<HTMLDivElement>(null);

  const loadJobs =
    async () => {
      try {
        setLoading(true);

        const res =
          await recruitmentService.getCampaigns();

        const activeJobs =
          res.filter(
            (item) =>
              item.status !==
              "CLOSED"
          );

        setCampaigns(
          activeJobs
        );
      } catch (err) {
        console.error(
          "Load recruitment campaigns error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSelectJob = (
    job: RecruitmentCampaign
  ) => {
    setSelectedJob(job);
    setShowForm(false);

    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  };

  const handleApply =
    () => {
      setShowForm(true);

      setTimeout(() => {
        formRef.current?.scrollIntoView(
          {
            behavior:
              "smooth",
            block: "start",
          }
        );
      }, 100);
    };

  return (
    // CHỈNH MÀU
    <div className="min-h-screen">
      <div className="bg-[#FF7733] text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20 flex justify-between items-start">

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              DVTransport
            </h1>

            <p className="text-4xl mt-6 text-lg leading-8">
              Gia nhập đội ngũ tài xế
              chuyên nghiệp của chúng tôi.
              Thu nhập ổn định, môi trường
              hiện đại và cơ hội phát triển
              lâu dài.
            </p>

          </div>

          <Link
            to="/login"
            className="
              flex
              items-center
              gap-2
              bg-[#DF613B]
              hover:bg-orange-600
              px-5
              py-3
              rounded-xl
              font-semibold
              transition
              shadow-lg
            "
          >
            <LogIn size={18} />
            Đăng nhập
          </Link>

        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">

        {/* ================= TITLE ================= */}

        <div className="flex items-center gap-4 mb-8">

          <h2 className="text-3xl font-bold text-slate-900 whitespace-nowrap">
            Cơ hội nghề nghiệp
          </h2>

          <div className="flex-1 h-[1px] bg-slate-200" />

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="bg-white border border-slate-200 rounded-[30px] p-10 text-center text-slate-500">
            Đang tải danh sách tuyển dụng...
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          campaigns.length ===
            0 && (
            <div className="bg-white border border-slate-200 rounded-[30px] p-14 text-center">

              <h3 className="text-2xl font-semibold text-slate-800">
                Hiện chưa có
                đợt tuyển dụng nào
              </h3>

              <p className="text-slate-500 mt-3">
                Vui lòng quay lại sau.
              </p>

            </div>
          )}

        {/* ================= JOB LIST ================= */}

        {!loading &&
          campaigns.length >
            0 && (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

                {campaigns.map(
                  (item) => (
                    <JobCard
                      key={
                        item.id
                      }
                      item={
                        item
                      }
                      selected={
                        selectedJob?.id ===
                        item.id
                      }
                      onClick={() =>
                        handleSelectJob(
                          item
                        )
                      }
                    />
                  )
                )}

              </div>

              {/* ================= DETAIL ================= */}

              {selectedJob && (
                <div className="mt-10 animate-in fade-in duration-300">

                  <JobDetail
                    item={
                      selectedJob
                    }
                    onApply={
                      handleApply
                    }
                  />

                </div>
              )}

              {/* ================= APPLICATION FORM ================= */}

              {selectedJob &&
                showForm && (
                  <div
                    ref={
                      formRef
                    }
                    className="mt-8 animate-in fade-in slide-in-from-bottom-3 duration-300"
                  >

                    <JobApplicationForm
                      campaign={
                        selectedJob
                      }
                    />

                  </div>
                )}
            </>
          )}
      </div>
    </div>
  );
}