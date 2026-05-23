import type { GpsHistoryDTO } from "../../types/gps";

interface Props {
  history: GpsHistoryDTO[];
}

export default function HistoryTable({
  history,
}: Props) {

  return (

    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">

      <div className="p-5 border-b border-slate-200">

        <h2 className="font-bold text-lg">
          Lịch sử hành trình
        </h2>

      </div>

      <div className="overflow-auto h-[700px]">

        <table className="w-full">

          <thead className="bg-slate-50 sticky top-0">

            <tr className="text-left">

              <th className="p-4">
                Thời gian
              </th>

              <th className="p-4">
                Latitude
              </th>

              <th className="p-4">
                Longitude
              </th>

              <th className="p-4">
                Vehicle
              </th>

            </tr>

          </thead>

          <tbody>

            {history.map((item) => (

              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >

                <td className="p-4">

                  {new Date(
                    item.recordedAt
                  ).toLocaleString(
                    "vi-VN"
                  )}

                </td>

                <td className="p-4">
                  {item.lat}
                </td>

                <td className="p-4">
                  {item.lng}
                </td>

                <td className="p-4">

                  #{item.vehicleId}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}