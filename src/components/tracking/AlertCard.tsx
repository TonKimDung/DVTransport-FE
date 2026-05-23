import type { AlertDTO } from "../../types/gps";

interface Props {
  alert: AlertDTO;
}

export default function AlertCard({
  alert,
}: Props) {

  const isDanger =
    alert.type === "ROUTE_WARNING";

  return (

    <div
      className={`rounded-2xl border p-4 ${
        isDanger
          ? "bg-red-50 border-red-200"
          : "bg-yellow-50 border-yellow-200"
      }`}
    >

      <h3 className="font-bold">
        {alert.type}
      </h3>

      <p className="text-sm mt-1 text-slate-600">
        {alert.message}
      </p>

      <p className="text-xs text-slate-400 mt-2">

        Trip #{alert.tripId}

      </p>

    </div>
  );
}