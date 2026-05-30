import {
  Calendar,
  CreditCard,
  Mail,
  MoreVertical,
  Phone,
} from "lucide-react";

import type {
  Driver,
} from "../../../types/driver";

import Menu from "../common/Menu";
import MenuItem from "../common/MenuItem";
import Info from "../common/Info";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  item: Driver;

  onEdit: (
    driver: Driver
  ) => void;

  onView: (
    driver: Driver
  ) => void;

  onInactive: (
    id: number
  ) => void;
}

export default function DriverCard({
  item,
  onEdit,
  onView,
  onInactive,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

      <div className="flex justify-between">

        <div className="w-full">

          <div className="flex items-center gap-4 mb-6">

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

          <div className="grid grid-cols-2 gap-6 text-slate-500">

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
                <CreditCard
                  size={18}
                />
              }
              text={`GPLX: ${item.licenseNumber}`}
            />

            <Info
              icon={
                <Calendar
                  size={18}
                />
              }
              text={`Hết hạn: ${formatDate(
                item.licenseExpiry
              )}`}
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
              onEdit(
                item
              )
            }
          >
            Chỉnh sửa
          </MenuItem>

          <MenuItem
            onClick={() =>
              onView(
                item
              )
            }
          >
            Xem chi tiết
          </MenuItem>

          <MenuItem
            onClick={() =>
              onInactive(
                item.id
              )
            }
          >
            Ngừng hoạt động
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}