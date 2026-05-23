import { Bell, X } from "lucide-react";

import type { AlertDTO } from "../../types/gps";

import AlertCard from "./AlertCard";
import EmptyState from "./EmptyState";

interface Props {
  open: boolean;
  alerts: AlertDTO[];
  onClose: () => void;
}

export default function AlertSidebar({
  open,
  alerts,
  onClose,
}: Props) {

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-[999]">

      {/* OVERLAY */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* SIDEBAR */}

      <div className="absolute right-0 top-0 h-full w-[420px] bg-white shadow-2xl flex flex-col">

        <div className="p-5 border-b border-slate-200 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Bell />

            <h2 className="font-bold text-lg">
              Cảnh báo realtime
            </h2>

          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
          >

            <X size={20} />

          </button>

        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">

          {alerts.length === 0 && (
            <EmptyState text="Chưa có cảnh báo" />
          )}

          {alerts.map((alert, index) => (

            <AlertCard
              key={index}
              alert={alert}
            />

          ))}

        </div>

      </div>

    </div>
  );
}