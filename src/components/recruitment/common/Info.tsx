import React from "react";

interface Props {
  icon: React.ReactNode;
  text?: string;
}

export default function Info({
  icon,
  text,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400">
        {icon}
      </span>

      <span className="text-sm text-slate-700">
        {text || "-"}
      </span>
    </div>
  );
}