import {
  Calendar,
  Briefcase,
  ArrowRight,
} from "lucide-react";

import type {
  RecruitmentCampaign,
} from "../../types/recruitment";

interface Props {
  item: RecruitmentCampaign;
  onApply: () => void;
}

export default function JobDetail({
  item,
  onApply,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8">

      <div className="flex items-center justify-between">

        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          Đang tuyển dụng
        </span>

        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={18} />
          {item.startDate} - {item.endDate}
        </div>
      </div>

      <h2 className="mt-6 text-4xl font-bold text-slate-900">
        {item.title}
      </h2>

      <div className="flex items-center gap-3 mt-4 text-slate-600">
        <Briefcase size={18} />
        Công ty vận tải
      </div>

      <div className="h-px bg-slate-200 my-8" />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Mô tả công việc
        </h3>

        <p className="leading-8 text-slate-600 whitespace-pre-wrap">
          {item.description}
        </p>
      </div>

      <button
        onClick={onApply}
        className="
          mt-10
          bg-orange-500
          hover:bg-orange-600
          text-white
          px-7
          py-4
          rounded-2xl
          font-semibold
          flex
          items-center
          gap-3
          transition
        "
      >
        Ứng tuyển ngay
        <ArrowRight size={20} />
      </button>
    </div>
  );
}