import {
  Calendar,
  ChevronRight,
} from "lucide-react";

import type {
  RecruitmentCampaign,
} from "../../types/recruitment";

interface Props {
  item: RecruitmentCampaign;

  selected?: boolean;

  onClick: () => void;
}

export default function JobCard({
  item,
  selected,
  onClick,
}: Props) {
  const isOpen =
    item.status ===
    "ACTIVE";

  return (
    <button
      onClick={
        onClick
      }
      className={`
        text-left
        w-full
        rounded-[30px]
        border
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg

        ${
          selected
            ? "border-orange-400 bg-orange-50 shadow-md"
            : "border-slate-200 bg-white"
        }
      `}
    >
      {/* STATUS */}

      <div className="flex items-center justify-between mb-5">
        <span
          className={`
            px-4 py-2
            rounded-full
            text-xs
            font-semibold

            ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {isOpen
            ? "Đang tuyển"
            : "Đã đóng"}
        </span>

        <ChevronRight
          className="text-slate-400"
          size={
            20
          }
        />
      </div>

      {/* TITLE */}

      <h3 className="text-xl font-bold text-slate-900 leading-8 line-clamp-2">
        {item.title}
      </h3>

      {/* DESCRIPTION */}

      <p className="text-slate-500 mt-3 line-clamp-3 leading-7 text-sm">
        {item.description}
      </p>

      {/* DATE */}

      <div className="mt-6 flex items-center gap-3 text-slate-500 text-sm">
        <Calendar
          size={18}
        />

        <span>
          {item.startDate}{" "}
          -{" "}
          {item.endDate}
        </span>
      </div>
    </button>
  );
}