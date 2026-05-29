import {
  AlertTriangle,
  Clock3,
  Truck,
} from "lucide-react";

import type {
  DriverWorkLog,
} from "../../../types/driverWorkLog";

interface Props {

  workLogs: DriverWorkLog[];
}

export default function WorkLogList({
  workLogs,
}: Props) {

  return (

    <div className="space-y-4">

      {workLogs.map((item) => {

        const isWarning =
          item.warningLevel ===
          "WARNING";

        const isDanger =
          item.warningLevel ===
          "DANGEROUS";

        return (

          <div
            key={item.id}
            className={`
              border rounded-2xl p-5 bg-white shadow-sm
              ${isDanger
                ? "border-red-300"
                : isWarning
                ? "border-orange-300"
                : "border-slate-200"}
            `}
          >

            <div className="flex items-start justify-between">

              <div className="space-y-3">

                <div>

                  <div className="text-lg font-semibold text-slate-800">
                    {item.driverName}
                  </div>

                  <div className="text-sm text-slate-500">
                    {item.tripCode}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-600">

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />

                    {item.drivingHours} giờ
                  </div>

                  <div className="flex items-center gap-2">
                    <Truck size={16} />

                    {item.tripCount} chuyến
                  </div>
                </div>

                {item.warningMessage && (

                  <div
                    className={`
                      flex items-center gap-2 text-sm font-medium
                      ${isDanger
                        ? "text-red-600"
                        : "text-orange-600"}
                    `}
                  >

                    <AlertTriangle size={16} />

                    {item.warningMessage}
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-400">

                {item.workDate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}