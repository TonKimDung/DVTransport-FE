import {
  AlertTriangle,
  Truck,
  Clock3,
  MapPin,
} from "lucide-react";

export default function IncidentTab() {

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Quản lý sự cố
        </h1>

        <p className="text-slate-500 mt-1">
          Theo dõi các sự cố vận tải realtime
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-4 gap-5">

        <IncidentStat
          title="Sự cố hôm nay"
          value="12"
          icon={<AlertTriangle />}
          color="bg-red-100 text-red-600"
        />

        <IncidentStat
          title="Xe gặp sự cố"
          value="5"
          icon={<Truck />}
          color="bg-orange-100 text-orange-600"
        />

        <IncidentStat
          title="Đang xử lý"
          value="3"
          icon={<Clock3 />}
          color="bg-blue-100 text-blue-600"
        />

        <IncidentStat
          title="GPS lỗi"
          value="2"
          icon={<MapPin />}
          color="bg-yellow-100 text-yellow-600"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-200">

          <h2 className="font-bold text-lg">
            Danh sách sự cố
          </h2>

        </div>

        <div className="overflow-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr className="text-left">

                <th className="p-4">
                  Thời gian
                </th>

                <th className="p-4">
                  Xe
                </th>

                <th className="p-4">
                  Loại sự cố
                </th>

                <th className="p-4">
                  Mức độ
                </th>

                <th className="p-4">
                  Trạng thái
                </th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-t border-slate-100">

                <td className="p-4">
                  22/05/2026 10:22
                </td>

                <td className="p-4">
                  51H-12345
                </td>

                <td className="p-4">
                  Mất GPS
                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-600">

                    Cao

                  </span>

                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">

                    Đang xử lý

                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function IncidentStat({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {

  return (

    <div className="bg-white rounded-3xl border border-slate-200 p-6">

      <div className="flex items-center justify-between mb-5">

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >

          {icon}

        </div>

      </div>

      <h2 className="text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {title}
      </p>

    </div>
  );
}