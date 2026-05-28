import {
  Calendar,
  MoreVertical,
} from "lucide-react";

import type {
  RecruitmentCampaign,
} from "../../../types/recruitment";

import Menu from "../common/Menu";
import MenuItem from "../common/MenuItem";
import Info from "../common/Info";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  item: RecruitmentCampaign;

  onClose: (
    id: number
  ) => void;
}

export default function RecruitmentCard({
  item,
  onClose,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

      <div className="flex justify-between">

        <div>
          <div className="flex items-center gap-4 mb-4">

            <h2 className="text-xl font-bold text-slate-900">
              {item.title}
            </h2>

            <StatusBadge
              status={
                item.status
              }
            />
          </div>

          <p className="text-base text-slate-500">
            {
              item.description
            }
          </p>
        </div>

        <Menu
          button={
            <button className="text-slate-400 hover:text-slate-700 transition">
              <MoreVertical size={24} />
            </button>
          }
        >
          <MenuItem
            onClick={() =>
              onClose(
                item.id
              )
            }
          >
            Đóng tuyển
          </MenuItem>
        </Menu>
      </div>

      <div className="border-t border-slate-200 mt-5 pt-5 grid grid-cols-2 gap-5">

        <Info
          icon={
            <Calendar
              size={18}
            />
          }
          text={`Bắt đầu: ${formatDate(
            item.startDate
          )}`}
        />

        <Info
          icon={
            <Calendar
              size={18}
            />
          }
          text={`Kết thúc: ${formatDate(
            item.endDate
          )}`}
        />
      </div>
    </div>
  );
}