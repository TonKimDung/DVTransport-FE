export default function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: "blue" | "yellow" | "orange" | "green";
}) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
      <div className={`${colorMap[color]} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>

      <p className="font-semibold text-slate-700 mb-2">{title}</p>
      <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}