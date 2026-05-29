import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function StatsGrid({
  children,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {children}
    </div>
  );
}