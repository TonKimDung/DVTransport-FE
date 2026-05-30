import {
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Users,
} from "lucide-react";

import type {
  JobApplication,
} from "../../../types/recruitment";

import type {
  ApplicationStatus,
} from "../../../types/status/applicationStatus";

import Menu from "../common/Menu";
import MenuItem from "../common/MenuItem";
import Info from "../common/Info";
import StatusBadge from "../common/StatusBadge";

interface Props {
  item: JobApplication;

  onUpdateStatus: (
    application: JobApplication,
    status: ApplicationStatus
  ) => void;
}

export default function ApplicationCard({
  item,
  onUpdateStatus,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

      <div className="flex justify-between">

        <div className="w-full">

          <div className="flex items-center gap-4 mb-4">

            <h2 className="text-xl font-bold text-slate-900">
              {
                item.fullName
              }
            </h2>

            <StatusBadge
              status={
                item.status
              }
            />
          </div>

          <p className="text-base text-slate-500 mb-5">
            Ứng tuyển:{" "}
            {
              item.campaignName
            }
          </p>

          <div className="grid grid-cols-2 gap-5 text-slate-500">

            <Info
              icon={
                <Phone
                  size={18}
                />
              }
              text={
                item.phone
              }
            />

            <Info
              icon={
                <Mail
                  size={18}
                />
              }
              text={
                item.email
              }
            />

            <Info
              icon={
                <MapPin
                  size={18}
                />
              }
              text={
                item.address
              }
            />

            <Info
              icon={
                <Users
                  size={18}
                />
              }
              text={`${item.experienceYears} năm kinh nghiệm`}
            />
          </div>
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
              onUpdateStatus(
                item,
                "REVIEWING"
              )
            }
          >
            Đang xem xét
          </MenuItem>

          <MenuItem
            onClick={() =>
              onUpdateStatus(
                item,
                "APPROVED"
              )
            }
          >
            Duyệt hồ sơ
          </MenuItem>

          <MenuItem
            onClick={() =>
              onUpdateStatus(
                item,
                "REJECTED"
              )
            }
          >
            Từ chối
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}