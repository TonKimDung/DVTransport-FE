import {
  AlertTriangle,
  Clock,
  MapPin,
  Truck,
} from "lucide-react";

import { useEffect, useState } from "react";

type IncidentDTO = {
  id: number;
  tripId: number;
  type: string;
  message: string;
  location: string;
  createdAt: string;
};

export default function IncidentPage() {
  const [incidents, setIncidents] = useState<IncidentDTO[]>([]);

  // demo load (sau này thay bằng API)
  useEffect(() => {
    const mock: IncidentDTO[] = [
      {
        id: 1,
        tripId: 101,
        type: "BROKEN_TRUCK",
        message: "Xe bị hỏng giữa đường",
        location: "Q.12 - TP.HCM",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        tripId: 102,
        type: "TRAFFIC_ACCIDENT",
        message: "Tai nạn nhẹ, kẹt xe",
        location: "Xa lộ Hà Nội",
        createdAt: new Date().toISOString(),
      },
    ];

    setIncidents(mock);
  }, []);

  return (
    <div className="space-y-6">

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

        <div className="p-5 border-b border-slate-200 flex items-center gap-2">
          <AlertTriangle />
          <h2 className="font-bold text-lg">
            Danh sách sự cố
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="p-4">Thời gian</th>
              <th className="p-4">Trip</th>
              <th className="p-4">Loại</th>
              <th className="p-4">Nội dung</th>
              <th className="p-4">Vị trí</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="p-4 text-sm">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </td>

                <td className="p-4 flex items-center gap-1">
                  <Truck size={16} />
                  #{item.tripId}
                </td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-semibold">
                    {item.type}
                  </span>
                </td>

                <td className="p-4">{item.message}</td>

                <td className="p-4 flex items-center gap-1 text-slate-600">
                  <MapPin size={16} />
                  {item.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}