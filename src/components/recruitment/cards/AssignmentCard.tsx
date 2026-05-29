import {
  MoreVertical,
} from "lucide-react";

import type {
  Assignment,
} from "../../../types/assignment";

import Menu from "../common/Menu";
import MenuItem from "../common/MenuItem";
import { formatDate } from "../../../utils/formatDate";

interface Props {
  item: Assignment;

  onDeactivate: (
    id: number
  ) => void;
}

export default function AssignmentCard({
  item,
  onDeactivate,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {
              item.driverName
            }
          </h2>

          <p className="text-base text-slate-500 mt-1">
            Phương tiện:{" "}
            {
              item.plateNumber
            }
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">
            Ngày bắt đầu
          </p>

          <p className="font-bold text-slate-900">
            {formatDate(
              item.assignedDate
            )}
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
              onDeactivate(
                item.id
              )
            }
          >
            Kết thúc phân công
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}