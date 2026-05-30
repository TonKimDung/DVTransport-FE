import React from "react";

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
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