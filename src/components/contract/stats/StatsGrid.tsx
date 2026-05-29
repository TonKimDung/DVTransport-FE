import type { ReactNode } from "react";
import StatCard from "./StatCard";

type StatsGridItem = {
  icon: ReactNode;
  title: string;
  value: number | string;
  color?: "blue" | "green" | "yellow" | "red";
};

export default function StatsGrid({
  items,
}: {
  items: StatsGridItem[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <StatCard
          key={index}
          icon={item.icon}
          title={item.title}
          value={item.value}
          color={item.color ?? "blue"}
        />
      ))}
    </div>
  );
}