import {
  AlertTriangle,
  Clock3,
  ShieldAlert,
  Truck,
  User,
} from "lucide-react";

import type { DriverWorkLog }
from "../../../types/driverWorkLog";

type Props = {
  item: DriverWorkLog;
};

export default function WorkLogCard({
  item,
}: Props) {

  console.log("WORK LOG =", item);

  const level =
    item.warningLevel
      ?.trim()
      ?.toUpperCase() || "NORMAL";

  const getWarningStyle = () => {

    switch (level) {

      case "DANGEROUS":
        return {
          badge:
            "bg-red-100 text-red-700 border-red-200",

          card:
            "border-red-200 bg-red-50/60",
        };

      case "WARNING":
        return {
          badge:
            "bg-orange-100 text-orange-700 border-orange-200",

          card:
            "border-orange-200 bg-orange-50/60",
        };

      default:
        return {
          badge:
            "bg-green-100 text-green-700 border-green-200",

          card:
            "border-green-200 bg-green-50/60",
        };
    }
  };

  const style = getWarningStyle();

  return (
    <div
      className={`border rounded-3xl p-6 shadow-sm ${style.card}`}
    >
      <div className="space-y-5">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <User
              size={24}
              className="text-orange-600"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {item.driverName}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Theo dõi giờ làm việc tài xế
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TRIP */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">

            <div className="flex items-center gap-3 mb-2">
              <Truck
                size={18}
                className="text-blue-600"
              />

              <p className="text-sm text-slate-500">
                Chuyến đi
              </p>
            </div>

            <p className="font-bold text-slate-900">
              {item.tripCode || "---"}
            </p>
          </div>

          {/* HOURS */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">

            <div className="flex items-center gap-3 mb-2">
              <Clock3
                size={18}
                className="text-orange-600"
              />

              <p className="text-sm text-slate-500">
                Giờ lái xe
              </p>
            </div>

            <p className="font-bold text-slate-900">
              {item.drivingHours || 0} giờ
            </p>
          </div>

          {/* STATUS */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">

            <div className="flex items-center gap-3 mb-2">
              <ShieldAlert
                size={18}
                className="text-red-600"
              />

              <p className="text-sm text-slate-500">
                Trạng thái
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}
            >
              {level}
            </span>
          </div>
        </div>

        {/* WARNING */}
        {item.warningMessage && (

          <div className="bg-white border border-red-200 rounded-2xl p-4 flex items-start gap-3">

            <AlertTriangle
              size={20}
              className="text-red-600 mt-0.5"
            />

            <div>
              <p className="font-semibold text-red-700">
                Cảnh báo
              </p>

              <p className="text-sm text-slate-700 mt-1">
                {item.warningMessage}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}