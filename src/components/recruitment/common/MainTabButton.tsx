import React from "react";

interface Props {
  active: boolean;
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function MainTabButton({
  active,
  title,
  icon,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 border-b-2 flex items-center gap-2 text-base font-semibold transition ${
        active
          ? "border-orange-500 text-orange-500"
          : "border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}