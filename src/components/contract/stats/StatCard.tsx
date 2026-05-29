export default function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: "blue" | "green" | "yellow" | "red";
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition">
      
      {/* ICON */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}
      >
        {icon}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs text-slate-500 font-medium">
          {title}
        </span>

        <span className="text-lg font-bold text-slate-900">
          {value}
        </span>
      </div>
    </div>
  );
}